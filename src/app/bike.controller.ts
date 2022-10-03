import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import AuthGuard from "src/auth.guard";
import Bike from "src/entity/bike";
import User from "src/entity/user";
import BikeService from "./bike.service";
import { AUser } from "./util";


@Controller('/bike')
export default class BikeController{
    constructor(private readonly bs: BikeService){}

    @Post('')
    async addBike(@Body() param: Bike){
        return this.bs.addBike(param)
    }

    @UseGuards(AuthGuard)
    @Get('')
    async getBikes(
        @Query()
        {page = '1', fromDate, toDate, model, color, location, rateAverage},
        @AUser() user: User,
    ){
       console.log('user is', user);
       return this.bs.getBikes(
        {
            page,
            fromDate,
            toDate,
            model,
            location,
            color,
            rateAverage
        },
        user,
       ); 
    }

    @Put('/:id')
    async updateBike(@Param('id') id: string, @Body() body: Bike){
        return this.bs.updateBike(id, body);
    }
}