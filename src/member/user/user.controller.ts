import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";

@Controller()
export class UserController {
  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async logIn(@Body() dto: LoginUserDto, @Res() res) {
    try {
      const accessToken = await this.userService.handleLogin(dto);
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

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res) {
    try {
      const token = this.generateAccessToken(req.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in googleLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    try {
      const token = this.generateAccessToken(req.user.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in kakaoLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("logout")
  async logout(@Res() res) {
    res.clearCookie("Authorization", { path: "/" });
  }

  @Post("signup")
  async createUser(@Body() dto: CreateUserDto, @Res() res) {
    const result = await this.userService.signUp(dto);
    res.send(result);
  }

  // @Put('update')
  // async updateUser(@Req() req, @Res() res){
  //   const token = req.cookies.Authorization;
  //   const result = await this.userService.update(token);
  // }

  // @Delete("withdrawal")
  // async withdrawalUser(@Req() req, @Res() res) {
  //   const token = req.cookies.Authorization;
  //   console.log(token);

  //   const result = await this.userService.withdrawal(token);
  //   res.send(result);
  // }
}
