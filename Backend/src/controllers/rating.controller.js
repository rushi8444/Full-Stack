import RatingModel from "../models/rating.model.js";
import db from "../config/database.js";

class RatingsController {

    static async submitRating(req, res) {
        try{
            const{storeId,rating} = req.body;
            const userId = req.user.id;

            const newRating = await RatingModel.create({ storeId, userId, rating });
            return res.status(200).json({
                success: true,
                message: "Rating saved successfully.",
                ...newRating
            });
        }catch(error){
            console.error("Error creating rating:", error);
            res.status(500).json({ success: false, error: "Failed to submit rating", message: error.message });
        }

    }

    //get owners store only 
    static async getOwnerStoreRatings(req,res){
        try{
            const userId = req.user.id;
            const ratings = await RatingModel.findByOwnerId(userId);
            res.status(200).json(ratings);
        }catch(error){
            console.error("Error fetching owner's ratings:", error);
            res.status(500).json({ error: "Failed to fetch owner's ratings" });
        }
    }

    //owner dashboard to get all ratings for their store
    static async getStoreRatings(req,res){
        try{
            const storeId = req.params.storeId;
            const ratings = await RatingModel.findByStoreId(storeId);
            res.status(200).json(ratings);
        }catch(error){
            console.error("Error fetching ratings:", error);
            res.status(500).json({ error: "Failed to fetch ratings" });
        }

    }

    static async getStoreOwnerDashboard(req, res) {
    try {
      const ownerId = req.user.id;
      const dashboardData = await RatingModel.findByStoreOwner(ownerId);

      return res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error loading dashboard data.',
        error: error.message,
      });
    }
  }

  // Admin Dashboard: System metrics (Total Users, Stores, Ratings)[cite: 1]
  static async getAdminDashboardMetrics(req, res) {
    try {
      const usersCount = await db.query('SELECT COUNT(*) FROM users;');
      const storesCount = await db.query('SELECT COUNT(*) FROM stores;');
      const ratingsCount = await db.query('SELECT COUNT(*) FROM ratings;');

      return res.status(200).json({
        success: true,
        data: {
          totalUsers: parseInt(usersCount.rows[0].count, 10),
          totalStores: parseInt(storesCount.rows[0].count, 10),
          totalRatings: parseInt(ratingsCount.rows[0].count, 10),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error loading admin metrics.',
        error: error.message,
      });
    }
  }



}

export default RatingsController;