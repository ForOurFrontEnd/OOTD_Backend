import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Seller } from "./entity/seller.entity";
import { CreateUserDto } from "../auth/dto/createuser.dto";
import { LoginUserDto } from "../auth/dto/loginuser.dto";

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>
  ) {}

  async signUp(dto: CreateUserDto): Promise<Seller> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const createdAt = new Date();
    const createdUser = await this.sellerRepository.save({
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

  async findByEmail(email: string): Promise<Seller> {
    return await this.sellerRepository.findOne({ where: { email } });
  }

  async login(user: Seller): Promise<string> {
    const payload = { user: { email: user.email }, type: "seller" };
    const accesstoken = this.generateAccessToken(payload);
    return accesstoken;
  }

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async withdrawal(token) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    const localUser = await this.sellerRepository.findOne({
      where: { email: user.email },
    });

    if (localUser) {
      const deleteResult = await this.sellerRepository.delete({
        id: localUser.id,
      });
      if (deleteResult.affected === 1) {
        return "삭제 성공!";
      } else {
        return "삭제 실패";
      }
    } else {
      return "잘못된 사용자정보입니다.";
    }
  }

  async decodeToken(token) {
    try {
      const verifiedToken = token.split(" ")[1];
      const decodeToken = verify(
        verifiedToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      return decodeToken;
    } catch (e) {
      console.error("decodeToken Error:", e);
      return null;
    }
  }
}
