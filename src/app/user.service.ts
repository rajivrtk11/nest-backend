import { HttpException, Injectable } from "@nestjs/common";
import * as Bcryptjs from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import User from "src/entity/user";
import { UserSchema } from "src/joi.schema";

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

    async signup(param: {password: string, name: string; email: string}){
        const {value, error} = UserSchema.validate(param);
        if(error) throw new HttpException(error.message, 400);
        const {email, password, name} = value;
        const u = await User.findOne({
            where: {email: email.toLowerCase()},
        })
        if(u) throw new HttpException('User already exist with the same email', 400);
        const user = new User();
        user.email = email.toLowerCase();
        user.password = Bcryptjs.hashSync(password, 10);
        user.name = name;
        user.isManager = false;
        try{
            await user.save();
        }
        catch(e){
            console.log(e);
        }

        return {
            id:user.id,
            email: user.email,
            name: user.name,
            isManager: user.isManager
        }
    }
}