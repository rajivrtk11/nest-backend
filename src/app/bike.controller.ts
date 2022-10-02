import { Body, Controller, Param, Post } from "@nestjs/common";
import Bike from "src/entity/bike";
import BikeService from "./bike.service";


@Controller('/bike')
export default class BikeController{
    constructor(private readonly bs: BikeService){}

    @Post('')
    async addBike(@Body() param: Bike){
        return this.bs.addBike(param)
    }
}