import bycrpt from 'bcrypt';
import UserModel from '../models/user.model.js';

class UsersController {
    static async updatePassword(req,res){
        try{
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            
            const user = await UserModel.findByIdWithPassword(userId);

            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "User not found"
                })
            }

            const isMatch = await bycrpt.compare(currentPassword, user.password);

            if(!isMatch){
                return res.status(401).json({
                    success : false,
                    message : "Current password is incorrect"
                })
            }

            const saltRounds = 10;
            const hashedPassword = await bycrpt.hash(newPassword, saltRounds);

            await UserModel.updatePassword(userId, hashedPassword);

            return res.status(200).json({
                success : true,
                message : "Password updated successfully"
            })



        }catch(error){
            return res.status(500).json({
                success : false,
                message : "Internal server error during password update.",
                error : error.message
            })
        }
    }

    static async createuser(req,res){
        try{
            const { name, email, password, address, role } = req.body;
            const user = await UserModel.findById(req.user.id);

            if(user.role !== "System Administrator"){
                return res.status(403).json({
                    success : false,
                    message : "Forbidden: You do not have permission to perform this action"
                })
            }

            const existingUser = await UserModel.findByEmail(email);

            if(existingUser){
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists.",
                    error: error.message
                })
            }

            const saltRounds = 10;
            const hashedPassword = await bycrpt.hash(password, saltRounds);

            const newUser = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                address,
                role
            });

            return res.status(201).json({
                success : true,
                message : "User created successfully",
                data : newUser
            })

        }catch(error){
            return res.status(500).json({
                success : false,
                message : "Internal server error during user creation.",
                error : error.message
            })
        }
    }

    static async getUsers(req,res){
        try {
            const { search = '', role = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;

            const users = await UserModel.findAll({
                search,
                role,
                sortBy,
                sortOrder,
            });

            return res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            return res.status(500).json({
            success: false,
            message: 'Error fetching users list.',
            error: error.message,
        });
    }
    }

    static async getUserById(req,res){
        try{
            const {id} = req.body;
            const user = await UserModel.findById(id);

            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "User not found"
                })
            }

            return res.status(200).json({
                success : true,
                data : user
            })
        }catch(error){
            return res.status(500).json({
                success : false,
                message : "Internal server error during fetching user by name.",
                error : error.message
            })
        }
    }
}

export default UsersController;