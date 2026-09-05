import StoreModel from "../models/store.model.js";

class StoresController {

    static async createStore(req,res){
        try{
            const { name, email, address, ownerId } = req.body;
            const newStore = await StoreModel.create({
                name,
                email,
                address,
                ownerId: ownerId || req.user.id
            });
            res.status(201).json(newStore);
        }catch(error){
            console.error("Error creating store:", error);
            res.status(500).json({ error: "Failed to create store" });
        }
    }

    static async getStores(req,res){
        try{
            const {search = '', sortBy = 'name', sortOrder = 'ASC'} = req.query;
            const stores = await StoreModel.findAll({search, userId: req.user?.id, sortBy, sortOrder});
            res.status(200).json(stores);
        }catch(error){
            console.error("Error fetching stores:", error);
            res.status(500).json({ error: "Failed to fetch stores" });
        }
    }
}

export default StoresController;