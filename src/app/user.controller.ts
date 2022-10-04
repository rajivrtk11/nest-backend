import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import User from "src/entity/user";
import ManagerGuard from "src/manager.guard";
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

    @UseGuards(ManagerGuard)
    @Post('/add')
    async addUser(@Body() { email, password, name, isManager }: User) {
        return this.us.addUser({ email, password, name, isManager });
    }

    @UseGuards(ManagerGuard)
    @Get('/')
    async getUsers(@Query() page = '1') {
        return this.us.getUsers(page);
    }

    @UseGuards(ManagerGuard)
    @Put('/:id')
    async updateUser(@Param('id') id, @Body() body) {
        return this.us.updateUser(id, body);
    }

    @UseGuards(ManagerGuard)
    @Delete('/:id')
    async deleteUser(@Param('id') id: string){
        return this.us.deleteUser(id);
    }
}