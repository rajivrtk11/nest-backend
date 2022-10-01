import { HttpException, Injectable } from "@nestjs/common";
import * as Bcryptjs from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import User from "src/entity/user";

@Injectable()
export default class UserService{
    async login(param: {password: string; email: string}){
        const {email, password} = param;
        const user = await User.findOne({
            where: {email: email.toLowerCase()},
            select: ['email', 'password', 'isManager', 'name', 'id'],
        });
        if(!user) throw new HttpException('Invalid email and password', 400);
        if(Bcryptjs.compareSync(password, user.password)){
            return{
                ...user,
                password:undefined,
                token: Jwt.sign(
                    {
                        id:user.id,
                    },
                    'secret',
                    { expiresIn: 'Id' },
                ),
            };
        }
        else throw new HttpException('Invalid email and password', 400);
    }
}