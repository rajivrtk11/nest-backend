import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import User from "src/entity/user";
import UserService from "./user.service";

@Controller('user')
export default class UserController {
    constructor(private readonly us: UserService) { }

    @Post('/login')
    async login(@Body() { email, password }) {
        return this.us.login({ email, password });
    }

    @Post('/signup')
    async signup(@Body() { password, name, email }) {
        return this.us.signup({ name, email, password });
    }

    @Post('/add')
    async addUser(@Body() { email, password, name, isManager }: User) {
        return this.us.addUser({ email, password, name, isManager });
    }

    @Get('/')
    async getUsers(@Query() page = '1') {
        return this.us.getUsers(page);
    }

    @Put('/:id')
    async updateUser(@Param('id') id, @Body() body) {
        return this.us.updateUser(id, body);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string){
        return this.us.deleteUser(id);
    }
}