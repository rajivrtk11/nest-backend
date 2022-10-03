import { HttpException, Injectable, RequestMapping } from "@nestjs/common";
import { query } from "express";
import { find } from "rxjs";
import Bike from "src/entity/bike";
import User from "src/entity/user";
import { BikeSchema, GetBikesFilter } from "src/joi.schema";
import { getRepository, In, QueryResult } from "typeorm";
import GenericService from "./generic.service";
import { PAZE_SIZE, toIntegerOrZero } from "./util";
import * as _ from 'lodash';
import Reservation from "src/entity/reservations";
import Rating from "src/entity/rating";

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

    async getBikes(
        param: {
            fromDate: string,
            toDate: string,
            color: string,
            rateAverage: string,
            model: string,
            location: string,
            page: string
        },
        authUser: User,
    ){
        const {value, error} = GetBikesFilter.validate(param);
        if(error) throw new HttpException(error.message, 400);
        const { fromDate, toDate, color, rateAverage, model, location, page } =
            value;
        await this.g.validateFromTo(fromDate, toDate);

        let query = getRepository(Bike).createQueryBuilder('bike');
        query = query.where('bike.isAvailable = :isAvailable', {
            isAvailable: true,
        });

        if(fromDate || toDate){
            const notAvailableBikeIds = await this.getNonAvailableBikes(
                fromDate,
                toDate,
            );
            if(notAvailableBikeIds.length > 0){
                query = query.where(`bike.id not in (:...notAvailableBikeIds)`,
                {notAvailableBikeIds},
                )
            }
        }
        if(color) query = query.where('bike.color = :color', {color});
        if(model) query = query.where('bike.model = :model', {model});
        if(location)
             query = query.where('bike.location = :location', {location});
        if(rateAverage)
             query = query.where('bike.rating = :rateAverage', {rateAverage});
        
        const take = PAZE_SIZE;
        const offset = (toIntegerOrZero(page) - 1) * PAZE_SIZE;
        const bikes = await query.take(take).offset(offset).getMany();
        const ratings = 
            bikes.length === 0
                ? []
                : await Rating.find({
                    where: { bikeId: In(bikes.map((b) => b.id)), userId: authUser.id },
                })
        
        for( const bike of bikes){
            for(const rating of ratings) {
                if(rating.bikeId === bike.id){
                    bike.userRating = rating.rating;
                }
            }
        }
        const bikesCount = await query.getCount();
        return { bikes, pageCount: Math.ceil(bikesCount/PAZE_SIZE)};
    }

    public async getNonAvailableBikes(fromDate, toDate){
        const reservations = await getRepository(Reservation)
            .createQueryBuilder('res')
            .where(
                `(res.fromDate >= :fromDate and res.fromDate <= :toDate) or
                 (res.toDate >= :fromDate and res.toDate <= :toDate) or
                 (res.fromDate >= :fromDate and res.toDate <= :toDate)
                `,
                { fromDate, toDate},
            )
            .getMany();
        const bikeIds = reservations.map( (r) => r.bikeId);
        return _.uniq(bikeIds);
    }
}