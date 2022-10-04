import { HttpException, Injectable } from "@nestjs/common";
import { Http2ServerRequest } from "http2";
import Reservation from "src/entity/reservations";
import User from "src/entity/user";
import { FindConditions } from "typeorm";
import GenericService from "./generic.service";
import { PAZE_SIZE, toIntegerOrZero } from "./util";


@Injectable()
export default class ReservationService {
    constructor( private readonly g: GenericService){}

    async getReservations({
        bikeId,
        page,
        userId,
    }: {
        bikeId: string;
        page: number;
        userId: string;
    }){
       const whereClause: FindConditions<Reservation> = {
         status: 'ACTIVE',
       }
       if(bikeId) whereClause.bikeId = toIntegerOrZero(bikeId);
       if(userId) whereClause.userId = toIntegerOrZero(userId);

       const reservations = await Reservation.find({
            where: whereClause,
            take: PAZE_SIZE,
            relations: ['user', 'bike'],
            skip: (toIntegerOrZero(page)-1)*PAZE_SIZE,
            order: { id: 'DESC'},
       });
       
       const totalReservationsCount = await Reservation.count({
            where: whereClause,
       });

       return{
        reservations,
        pageCount: Math.ceil(totalReservationsCount / PAZE_SIZE),
       };
    }

    async cancelReservation(rid: string, user: User){
        if(user.isManager) throw new HttpException('Permisssion denied', 403);

        const res = await Reservation.findOne(rid);
        if(!res) throw new HttpException('Not Found', 404);
        if(res.userId != user.id)
            throw new HttpException('Permission Denied', 403)
        if(res.status === 'INACTIVE')
            throw new HttpException('Reservation is already cancelled', 400);
        res.status = 'INACTIVE';
        await Reservation.delete(rid)
        return {};
    }
}