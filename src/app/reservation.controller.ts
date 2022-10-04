import { Controller, Delete, Get, Param, Query, UseGuards } from "@nestjs/common";
import AuthGuard from "src/auth.guard";
import ReservationService from "./reservation.service";
import { AUser } from "./util";

@Controller('reservation')
export default class ReservationController{
    constructor(private readonly rs: ReservationService){}

    @UseGuards(AuthGuard)
    @Get('')
    async getReservations(
        @Query()
        {
            userId,
            bikeId,
            page
        }:{
            page?: number;
            userId?: string;
            bikeId: string;
        }
    ){
        return this.rs.getReservations({ userId, bikeId, page});
    }

    @UseGuards(AuthGuard)
    @Delete('/cancel/:rid')
    async cancelReservation(@Param('rid') rid: string, @AUser() user){
        return this.rs.cancelReservation(rid, user);
    }
}