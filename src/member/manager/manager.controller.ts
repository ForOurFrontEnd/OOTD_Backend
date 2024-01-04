import { Body, Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";

@Controller("manager")
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post("login")
  async logIn(@Body() dto: LoginUserDto, @Res() res) {
    try {
      const accessToken = await this.managerService.handleLogin(dto);
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.status(201).send("localLogin ok");
    } catch (error) {
      console.error("Error in localLogin:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("logout")
  async logout(@Res() res) {
    res.clearCookie("Authorization", { path: "/" });
  }

  @Post("signup")
  async createUser(@Body() dto: CreateUserDto, @Res() res) {
    const result = await this.managerService.signUp(dto);
    res.send(result);
  }

  @Delete("withdrawal")
  async withdrawalUser(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const result = await this.managerService.withdrawal(token);
    res.send(result);
  }
}
