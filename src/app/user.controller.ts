import { Body, Controller, Post } from "@nestjs/common";
import UserService from "./user.service";

@Controller('user')
export default class UserController{
    constructor(private readonly us: UserService){}

    @Post('/login')
    async login(@Body() {email, password}){
        return this.us.login({email, password});
    }
    
}