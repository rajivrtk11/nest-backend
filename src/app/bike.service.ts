import { HttpException, Injectable } from "@nestjs/common";
import Bike from "src/entity/bike";
import { BikeSchema } from "src/joi.schema";
import GenericService from "./generic.service";


@Injectable()
export default class BikeService {
    constructor(private readonly g: GenericService){}

    async addBike(param: Bike){
        const {value, error} = BikeSchema.validate(param);
        if(error) throw new HttpException(error.message, 400);
        const bike = new Bike();
        Object.assign(bike, value);
        await bike.save()
        return bike;
    }
}