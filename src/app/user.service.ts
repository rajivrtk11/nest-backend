import { HttpException, Injectable } from "@nestjs/common";
import * as Bcryptjs from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import User from "src/entity/user";
import { UserSchema, UserUpdateSchema } from "src/joi.schema";
import { PAZE_SIZE, toIntegerOrZero } from "./util";

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
                    { expiresIn: '1d' },
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

    async addUser(param: {
        password:string;
        name:string;
        isManager:boolean;
        email:string
    }){
        const {id} = await this.signup(param);
        const user = await User.findOne(id);
        user.isManager = param.isManager;
        
        // console.log('the user is', user);
        // user.isManager = param.isManager;
        console.log('the user is', user);
        await user.save();
        return user;
    }

    async getUsers(page: string){
        const users = await User.find({
            take: PAZE_SIZE,
            skip: (toIntegerOrZero(page) - 1)*PAZE_SIZE,
            order: {id: 'DESC'},
        });
        const totalUsers = await User.count({});
        return {users, pageCount: Math.ceil(totalUsers / PAZE_SIZE)};
    }

    async updateUser(
        id,
        param: {
            name?: string;
            email?: string;
            password?: string;
            isManager?: boolean;
        }
    ){
        const { value, error } = UserUpdateSchema.validate(param);
        if(error) throw new HttpException(error.message, 400);
        const {name, email, password, isManager} = value;
        const user = await User.findOne(id);
        if(name) user.name = name;
        if(email){
            const existingUser = await User.findOne({
                where:{
                    email: email.toLowerCase()
                }
            });
            if(existingUser && existingUser?.id != Number(id))
                throw new HttpException(' Email already exist', 400);
            else user.email = email;
        }
        if(isManager === true || isManager === false){
            user.isManager = isManager;
         }

        if(password) user.password = Bcryptjs.hashSync(password, 10);

        await user.save();
        return{
        id: id,
        email: user.email,
        name: user.name,
        isAdmin: user.isManager,
        }
    }

    async deleteUser(id: string){
        await User.delete(id);
    }
}