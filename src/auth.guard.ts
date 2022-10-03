import { CanActivate, ExecutionContext } from "@nestjs/common";
import User from "./entity/user";
import * as Jwt from 'jsonwebtoken';

export default class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const jwt = request.headers.jwt;
        console.log({jwt});
        const user: User = await this.validatejwt(jwt);
        request.user = user;
        request.jwt = jwt;
        return !!user;
    }

    async validatejwt(jwt): Promise<User>{
        try{
            const {id} = await Jwt.verify(jwt, 'secret');
            const user = await User.findOne(id);
            return user;
        }
        catch(e){
            return undefined;
        }
    }
}