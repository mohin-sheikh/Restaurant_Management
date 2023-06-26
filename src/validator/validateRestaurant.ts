import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const restaurantSchema = Joi.object({
    restaurant_name: Joi.string().required().messages({
        'string.base': 'Restaurant name must be a string.',
        'any.required': 'Restaurant name is required.',
    }),
    address: Joi.string().required().messages({
        'string.base': 'Address must be a string.',
        'any.required': 'Address is required.',
    }),
    veg_only: Joi.boolean().required().messages({
        'boolean.base': 'vegOnly must be a boolean.',
        'any.required': 'vegOnly is required.',
    }),
    cost: Joi.number().required().messages({
        'number.base': 'Cost must be a number.',
        'any.required': 'Cost is required.',
    }),
    cuisine_types: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Cuisine types must be an array.',
        'array.items': 'Cuisine types must be an array of strings.',
        'any.required': 'Cuisine types is required.',
    }),
    isOpen: Joi.boolean().required().messages({
        'boolean.base': 'isOpen must be a boolean.',
        'any.required': 'isOpen is required.',
    }),
});

export function validateRestaurant(req: Request, res: Response, next: NextFunction) {
    const { error } = restaurantSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail: { message: any; }) => detail.message);
        return res.status(400).json({ errors });
    }

    next();
}
