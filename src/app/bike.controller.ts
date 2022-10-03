import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import AuthGuard from "src/auth.guard";
import Bike from "src/entity/bike";
import Reservation from "src/entity/reservations";
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

    @Delete('/:id')
    async deleteBike(@Param('id') id: string){
        return this.bs.deleteBike(id);
    }

    @UseGuards(AuthGuard)
    @Post('/:bikeId/review')
    async addRating(
        @Param('bikeId') bikeId: string,
        @Body() {rating}: {rating: number},
        @AUser() user,
    ){
        return this.bs.addBikeRating(bikeId, rating, user);
    }

    @UseGuards(AuthGuard)
    @Post('/reserve')
    async reserveBike(@Body() body: Reservation, @AUser() user: User){
        return this.bs.reserveBike(body, user)
    }
}