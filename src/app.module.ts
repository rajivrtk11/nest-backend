import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import UserController from './app/user.controller';
import UserService from './app/user.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import User from './entity/user';
import BikeController from './app/bike.controller';
import BikeService from './app/bike.service';
import GenericService from './app/generic.service';
import Bike from './entity/bike';
import Reservation from './entity/reservations';
import Rating from './entity/rating';
import ReservationController from './app/reservation.controller';
import ReservationService from './app/reservation.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User, Bike, Reservation, Rating],
      synchronize: true,
      logging: 'all'
    })
  ],
  controllers: [AppController, UserController, BikeController, ReservationController],
  providers: [AppService, UserService, BikeService, GenericService, ReservationService],
})
export class AppModule {}
