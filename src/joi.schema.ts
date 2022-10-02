import * as Joi from 'joi';

export const UserSchema = Joi.object({
    name:Joi.string().min(3).max(30).required(),
    password:Joi.string().min(4).required(),
    email:Joi.string().email().required(),
    isManager: Joi.boolean(),
});

export const UserUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(4).allow(null),
    isManager: Joi.boolean().required(),
    email: Joi.string().email().required(),    
})

export  const BikeSchema = Joi.object({
    location: Joi.string().min(3).max(100).required(),
    model: Joi.string().min(3).max(100).required(),
    color: Joi.string().min(3).max(100).required(),
    isAvailable: Joi.boolean().required(),
})