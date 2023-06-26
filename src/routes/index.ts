import express from 'express';
import restaurantRouter from './restaurantRouter';
// Import other routers if needed

const router = express.Router();

router.use('/restaurants', restaurantRouter);
// Add other routers using router.use() if needed

export default router;
