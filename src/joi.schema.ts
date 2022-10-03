import * as Joi from 'joi';
import * as moment from 'moment';

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

export const dateTimeValidator = (value, helper) => {
    try{
        const date = moment(value, 'YYYY-MM-DD HH:mm', true);
        if(date.isValid())
            if(
                date.format('YYYY-MM-DD') < '2000-01-01 00:00' ||
                date.format('YYYY-MM-DD') > '2030-01-01 00:00' 
            )
            return helper.message(
                'Date range should be between 2000-01-01 00:00 and 2030-01-01 00:00'
            )
            else return value;
        else{
            return helper.message(
                'Invalid Value. Acceptable format is YYYY-MM-DD HH:mm',
            );
        }
    }
    catch(e){
        return helper.message(
            'Invalid Value. Acceptable format is YYYY-MM-DD HH:mm',
        )
    }
}

export const GetBikesFilter = Joi.object({
    fromDate: Joi.string()
        .default('2000-01- 00:00:00')
        .custom(dateTimeValidator),
    toDate: Joi.string().default('2030-01-01 00:00:00').custom(dateTimeValidator),
    color: Joi.string().allow(null),
    rateAverage: Joi.number().min(1).max(5).allow(null),
    model: Joi.string().allow(null),
    location: Joi.string().allow(null),
    page: Joi.number().min(1).allow(null),     
});

export const ReservationSchema = Joi.object({
    bikeId: Joi.number().min(1).required(),
    fromDate: Joi.string().required().custom(dateTimeValidator),
    toDate: Joi.string().required().custom(dateTimeValidator),
});