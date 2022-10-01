import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import UserController from './app/user.controller';
import UserService from './app/user.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import User from './entity/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User],
      synchronize: true,
      logging: 'all'
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
