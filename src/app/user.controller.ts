import { Body, Controller, Post } from "@nestjs/common";
import User from "src/entity/user";
import UserService from "./user.service";

@Controller('user')
export default class UserController{
    constructor(private readonly us: UserService){}

    @Post('/login')
    async login(@Body() {email, password}){
        return this.us.login({email, password});
    }

    @Post('/signup')
    async signup(@Body() {password, name, email}){
       return this.us.signup({name, email, password});
    }
    
    @Post('/add')
    async addUser(@Body() {email, password, name, isManager}: User){
        return this.us.addUser({email, password, name, isManager});
    }
}