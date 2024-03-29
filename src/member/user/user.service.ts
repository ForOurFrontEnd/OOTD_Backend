import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";
import { User } from './entity/user.entity';
import { UserResponseDto } from './dto/response/user_response.dto';
import { isUint16Array } from 'util/types';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  
  async signUp(dto: CreateUserDto): Promise<UserResponseDto> {
    const isEmailExist = await this.userRepository.findOne({ where: { email: dto.email } });
    const isKakaoEmailExist = await this.userRepository.findOne({ where: { kakao_email: dto.email } });
    const isGoogleEmailExist = await this.userRepository.findOne({ where: { google_email: dto.email } });

    if (!isEmailExist || !isKakaoEmailExist || !isGoogleEmailExist) {
      dto.password = await bcrypt.hash(dto.password, 10);
      const createdAt = new Date();
      await this.userRepository.save({
        email: dto.email,
        name: dto.name,
        photo: '/images/profile/default_image.jpeg',
        password: dto.password,
        createdAt: createdAt,
      });
      return ({
        message: '해당 계정 생성에 성공했습니다.',
        success: true,
        data: null
      });
    } else {
      return ({
        message: '해당 계정은 이미 생성되었습니다.',
        success: false,
        data: null
      });
    }
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
      let user = await this.findByEmail(dto.email);
      const generatedPlatform = await this.findGeneratedPlatform(dto.email)

      const User = {
        email: user.email,
        photo: user.photo,
        name: user.name,
        isLogined: true,
        loginPlatform: 'ootd',
        generatedPlatform
      }
      const token = await this.generateAccessToken(User);
      const accessToken = `Bearer ${token}`;
      return ({
        message: '해당 계정 로그인에 성공했습니다.',
        success: true,
        accessToken
      });
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

  async findByKakaoEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { kakao_email: email } });
  }

  async findByGoogleEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { google_email: email } });
  }

  async generateAccessTokenGoogle(user: any): Promise<string> {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async generateAccessToken(user: any): Promise<string> {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async findGeneratedPlatform(email: string){
    const user = await this.getOOTDUser(email);
    const data = [{ ootd: user.email }, { kakao: user.kakao_email }, { google: user.google_email }]
    return data
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

  async changeProfileUrl(email: string, url: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      await this.userRepository.update(user.u_id, { photo: `http://localhost:4000/uploads/${url}` });
    } else {
      throw new Error('User not found');
    }
  }

  async getProfilePhotoPath(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    return user.photo
  }

  async getPoint(email: string) {
    const user = await this.findByEmail(email)
    const formattedPoint = await user.point
    return formattedPoint
  }

  async getPhoneNumber(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    return user.phone_number
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      const result = await this.userRepository.delete({ email });
      return result.affected > 0; 
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async updateUserName(email: string, newName: string): Promise<boolean> {
    try {
      const userToUpdate = await this.findByEmail(email);

      if (!userToUpdate) {
        return false;
      }
      await this.userRepository.update(userToUpdate.u_id, { name: newName });
      return true;
    } catch (error) {
      console.error("Error updating user name:", error);
      return false;
    }
  }

  async getName(email: string) {
    try {
      const user = await this.findByEmail(email)

      if (!user) {
        return false;
      }
      return user.name;
    } catch (error) {
      console.log("Error in get User's name", error);
      return false;
    }
  }

  async decodeToken(cookie: string) {
    try {
      const token = cookie.split('Authorization=Bearer%20')[1];
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
