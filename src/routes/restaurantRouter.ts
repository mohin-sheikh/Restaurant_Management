import express from 'express';
import RestaurantController from '../controllers/restaurantController';
import { validateRestaurant } from '../validator/validateRestaurant'

const router = express.Router();

// Create restaurant
router.post('/', validateRestaurant, RestaurantController.createRestaurant);

// Get all restaurants
router.get('/', RestaurantController.getAllRestaurants);

// Get a restaurant by ID
router.get('/:id', RestaurantController.getRestaurantById);

// Update a restaurant by ID
router.put('/:id', RestaurantController.updateRestaurantById);

// Delete a restaurant by ID
router.delete('/:id', RestaurantController.deleteRestaurantById);

export default router;
