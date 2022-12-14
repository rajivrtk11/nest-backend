import { HttpException, Injectable } from "@nestjs/common";
import Bike from "src/entity/bike";
import { toIntegerOrZero } from "./util";

@Injectable()
export default class GenericService {
    async validateFromTo(from: string, to: string){
        if(!from || !to)
            throw new HttpException(
                'From date and to date both should be present',
                400,
            )
        if(from >= to)
            throw new HttpException(
                'From datetime should be less than to datetime',
                400,
            )
    }

    async validateBike(bikeId: string | number){
        const bike = await Bike.findOne(toIntegerOrZero(bikeId));
        if(bike) return bike;
        if(!bike) throw new HttpException('Bike not found', 400);
    }
}