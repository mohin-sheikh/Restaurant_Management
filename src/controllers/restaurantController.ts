import { Request, Response } from 'express';
import { Op, QueryTypes, literal } from 'sequelize';
import Restaurant from '../models/restaurant';
import sequelize from "../database/database";

class RestaurantController {
    static async createRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await Restaurant.create(req.body);
            return res.status(201).json(restaurant);
        } catch (error) {
            console.error('Error creating restaurant:', error);
            return res.status(500).json({ error: 'Failed to create restaurant' });
        }
    }

    static async getAllRestaurants(req: Request, res: Response) {
        try {
            const { isVeg, cost, cuisines } = req.query;
            const whereClause: any = {};

            if (isVeg) {
                whereClause.veg_only = isVeg === 'true';
            }

            if (cost) {
                let costRange: [number, number] = [0, 9999]; // Default range, adjust as needed

                switch (cost) {
                    case 'Low':
                        costRange = [0, 10];
                        break;
                    case 'Medium':
                        costRange = [11, 20];
                        break;
                    case 'High':
                        costRange = [21, 9999];
                        break;
                    default:
                        break;
                }

                whereClause.cost = {
                    [Op.between]: costRange,
                };
            }

            let query = 'SELECT * FROM restaurant';

            if (isVeg || cost || cuisines) {
                query += ' WHERE';

                if (isVeg) {
                    query += ` veg_only = ${isVeg === 'true'}`;
                }

                if (cost) {
                    if (isVeg) {
                        query += ' AND';
                    }
                    query += ` cost BETWEEN ${whereClause.cost[Op.between][0]} AND ${whereClause.cost[Op.between][1]}`;
                }

                if (cuisines) {
                    if (isVeg || cost) {
                        query += ' AND';
                    }
                    const cuisineArray = cuisines.toString().split(',');
                    query += ` cuisine_types @> ARRAY[${cuisineArray.map(() => '?').join(',')}]`;
                    whereClause.cuisineArray = cuisineArray;
                }
            }

            const [restaurants, _] = await sequelize.query(query, {
                replacements: whereClause.cuisineArray || [],
                type: QueryTypes.SELECT,
            });

            if (!restaurants) {
                return res.status(404).json({ error: 'No restaurants found based on the provided filters.' });
            }

            return res.status(200).json(restaurants);
        } catch (error) {
            console.error('Error getting restaurants:', error);
            return res.status(500).json({ error: 'Failed to get restaurants' });
        }
    }

    static async getRestaurantById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const restaurant = await Restaurant.findByPk(id);
            if (restaurant) {
                return res.status(200).json(restaurant);
            } else {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
        } catch (error) {
            console.error('Error getting restaurant:', error);
            return res.status(500).json({ error: 'Failed to get restaurant' });
        }
    }

    static async updateRestaurantById(req: Request, res: Response) {
        const { id } = req.params;
        console.log(id);

        try {
            const [rowsAffected] = await Restaurant.update(req.body, {
                where: { id: id },
            });
            if (rowsAffected > 0) {
                const updatedRestaurant = await Restaurant.findByPk(id);
                return res.status(200).json(updatedRestaurant);
            } else {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
        } catch (error) {
            console.error('Error updating restaurant:', error);
            return res.status(500).json({ error: 'Failed to update restaurant' });
        }
    }

    static async deleteRestaurantById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const rowsAffected = await Restaurant.destroy({
                where: { id: id },
            });
            if (rowsAffected > 0) {
                return res
                    .status(200)
                    .json({ message: 'Restaurant deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            return res.status(500).json({ error: 'Failed to delete restaurant' });
        }
    }
}

export default RestaurantController;
