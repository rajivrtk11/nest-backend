import { CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import User from "./entity/user";
import * as Jwt from 'jsonwebtoken';

export default class ManagerGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const jwt = request.headers.jwt;
        console.log({jwt});
        const user = await this.validatejwt(jwt);
        request.user = user;
        if(user) {
            if(user.isManager) return true;
            else throw new HttpException('Permission Denied', 403);
        }
        else return false;
    }

    async validatejwt(jwt): Promise<User> {
        try {
            const { id } = await Jwt.verify(jwt, 'secret'); 
            const user = await User.findOne(id);
            return user;
        }
        catch(e) {
            return undefined;
        }
    }

}