import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("login")
  async logIn(@Body() dto: LoginUserDto, @Res() res) {
    try {
      const response = await this.userService.handleLogin(dto);
      res.cookie("Authorization", response.accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.status(201).send(response);
    } catch (error) {
      console.error("Error in localLogin:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res) {
    try {
      const token = await this.userService.generateAccessToken(req.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.status(201).redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in googleLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    try {
      const token = await this.userService.generateAccessToken(req.user.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.status(201).redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in kakaoLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("logout")
  async logout(@Res() res) {
    res
      .clearCookie("Authorization", { path: "/" })
      .redirect("http://localhost:3000");
  }

  @Post("signup")
  async createUser(@Body() dto: CreateUserDto, @Res() res) {
    const result = await this.userService.signUp(dto);
    res.status(200).send(result);
  }

  @Post('cookie')
  async decodeCookie(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      res.status(200).send(user)
    }
  }

  @Get('point')
  async getPoint(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      const point = await this.userService.getPoint(user.user.email)
      const formattedPoint = point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      res.status(200).send(formattedPoint)
    }
  }

  @Get('phone_number')
  async getPhoneNumber(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      const phoneNumber = await this.userService.getPhoneNumber(user.user.email)
      res.status(200).send(phoneNumber)
    }
  }

  @Post('withdrawal')
  async deleteUser(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      await this.userService.deleteUser(user.user.email)
      res.clearCookie("Authorization", { path: "/" });
    }
  }

  @Post('update_name')
  async updateName(@Headers('cookie') cookie: string, @Body('otherName') newName , @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      await this.userService.updateUserName(user.user.email, newName)
      res.status(200).send('success')
    }
  }

  @Get('name')
  async getName(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    if (cookie) {
      const user = await this.userService.decodeToken(cookie);
      const name = await this.userService.getName(user.user.email)
      res.status(200).send(name)
    }
  }
}