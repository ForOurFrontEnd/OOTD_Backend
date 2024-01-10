import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const createdAt = new Date();
    const createdUser = await this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      photo: dto.photo,
      createdAt: createdAt,
    });
    return createdUser;
  }

  async handleLogin(dto: LoginUserDto) {
    try {
      const isEmailValid = await this.isValidateEmail(dto.email);
      if (!isEmailValid) {
        throw new Error("올바른 이메일 형식이 아닙니다.");
      }
      const isUser = await this.findByEmail(dto.email);
      if (!isUser) {
        throw new Error("이메일 혹은 패스워드를 찾을 수 없습니다.");
      }
      const isPassword = await this.isValidateUser(dto.email, dto.password);
      if (isPassword === false) {
        throw new Error("이메일 혹은 패스워드를 찾을 수 없습니다.");
      }
      const user = await this.findByEmail(dto.email);
      const token = await this.login(user);
      const accessToken = `Bearer ${token}`;
      return accessToken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async isValidateUser(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) {
      return false;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }

  async isValidateEmail(email: string): Promise<boolean> {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async login(user: User): Promise<string> {
    const payload = { user: { email: user.email }, type: "buyer" };
    const accesstoken = this.generateAccessToken(payload);
    return accesstoken;
  }

  async generateAccessToken(user: any): Promise<string> {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async findByEmailOrSave(email, photo, name, isAutoLogin): Promise<User> {
    const isUser = await this.getOOTDUser(email);
    if (!isUser) {
      const newUser = await this.userRepository.save({
        email,
        photo,
        name,
        isAutoLogin
      });
      return newUser;
    }
    return isUser;
  }

  async findByKakaoEmailOrSave(email, photo, name, isAutoLogin): Promise<User> {
    const isUser = await this.getKaKaoAutoLoginUser(email);
    if (!isUser) {
      const newUser = await this.userRepository.save({
        email,
        kakao_email:email,
        photo,
        name,
        isAutoLogin
      });
      return newUser;
    }
    return isUser;
  }

  async  findByGoogleEmailOrSave(email, photo, name, isAutoLogin): Promise<User> {
    const isUser = await this.getGoogleAutoLoginUser(email);
    if (!isUser) {
      const newUser = await this.userRepository.save({
        email,
        google_email:email,
        photo,
        name,
        isAutoLogin
      });
      return newUser;
    }
    return isUser;
  }

  async getOOTDUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async getKaKaoAutoLoginUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { kakao_email: email },
    });
    return user;
  }

  async getGoogleAutoLoginUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { google_email: email },
    });
    return user;
  }

  async decodeToken(token: string) {
    try {
      const decodeToken = verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      )
      return decodeToken;
    } catch (e) {
      console.error("decodeToken Error:", e);
      return null;
    }
  }
}
