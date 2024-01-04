import { Body, Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";

@Controller("seller")
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post("login")
  async logIn(@Body() dto: LoginUserDto, @Res() res) {
    try {
      const accessToken = await this.sellerService.handleLogin(dto);
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
    const result = await this.sellerService.signUp(dto);
    res.send(result);
  }

  @Delete("withdrawal")
  async withdrawalUser(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const result = await this.sellerService.withdrawal(token);
    res.send(result);
  }
}
