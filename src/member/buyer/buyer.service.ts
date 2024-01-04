import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalBuyer } from "./entity/localbuyer.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Storage } from "@google-cloud/storage";
import { SocialBuyer } from "./entity/socialbuyer.entity";
import { LoginUserDto } from "../auth/dto/loginuser.dto";
import { CreateUserDto } from "../auth/dto/createuser.dto";
import { randomUUID } from "crypto";
import { UpdateUserDto } from "../auth/dto/updateuser.dto";

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(LocalBuyer)
    private localBuyerRepository: Repository<LocalBuyer>,
    @InjectRepository(SocialBuyer)
    private socialBuyerRepository: Repository<SocialBuyer>
  ) {}
  private storage: Storage;
  private readonly bucketName = process.env.GCP_BUCKETNAME;

  async signUp(dto: CreateUserDto): Promise<LocalBuyer> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const createdAt = new Date();
    const createdUser = await this.localBuyerRepository.save({
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

  async findByEmail(email: string): Promise<LocalBuyer> {
    return await this.localBuyerRepository.findOne({ where: { email } });
  }

  async login(user: LocalBuyer): Promise<string> {
    const payload = { user: { email: user.email }, type: "localBuyer" };
    const accesstoken = this.generateAccessToken(payload);
    return accesstoken;
  }

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async findByEmailOrSave(email, photo, name): Promise<SocialBuyer> {
    const isUser = await this.getUser(email);
    if (!isUser) {
      const newUser = await this.socialBuyerRepository.save({
        email,
        photo,
        name,
      });
      return newUser;
    }
    return isUser;
  }

  async getUser(email: string): Promise<SocialBuyer> {
    const user = await this.socialBuyerRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async update(token, dto: UpdateUserDto, photo) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    if (type === "localBuyer") {
      const localBuyer = await this.localBuyerRepository.findOne({
        where: { email: user.email },
      });
      if (dto.email) localBuyer.email = dto.email;
      if (dto.name) localBuyer.name = dto.name;
      if (photo) {
        this.imageUpload(photo, localBuyer);
      }
      const updateBuyer = await this.localBuyerRepository.save(localBuyer);
      return updateBuyer;
    } else if (type === "socialBuyer") {
      const socialBuyer = await this.socialBuyerRepository.findOne({
        where: { email: user.email },
      });
      if (dto.email) socialBuyer.email = dto.email;
      if (dto.name) socialBuyer.name = dto.name;
      if (photo) {
        this.imageUpload(photo, socialBuyer);
      }
      const updateBuyer = await this.socialBuyerRepository.save(socialBuyer);
      return updateBuyer;
    } else {
      return "잘못된 유저정보 입니다.";
    }
  }

  async imageUpload(photo, buyer) {
    const fileName = `${Date.now()}_${randomUUID()}`;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    await new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        throw new Error(`Unable to upload profile picture: ${error}`);
      });

      blobStream.on("finish", async () => {
        const photoUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        buyer.photo = photoUrl;
      });

      blobStream.end(photo.buffer);
    });
  }

  async withdrawal(token) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    const localBuyer = await this.localBuyerRepository.findOne({
      where: { email: user.email },
    });

    if (localBuyer) {
      const deleteResult = await this.localBuyerRepository.delete({
        id: localBuyer.id,
      });
      if (deleteResult.affected === 1) {
        return "삭제 성공!";
      } else {
        return "삭제 실패";
      }
    } else {
      const socialBuyer = await this.socialBuyerRepository.findOne({
        where: { email: user.email },
      });
      if (socialBuyer) {
        const deleteResult = await this.socialBuyerRepository.delete({
          id: socialBuyer.id,
        });
        if (deleteResult.affected === 1) {
          return "삭제 성공!";
        } else {
          return "삭제 실패";
        }
      } else {
        return "잘못된 유저 정보 입니다.";
      }
    }
  }

  async getBuyer(token) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    const localBuyer = await this.localBuyerRepository.findOne({
      where: { email: user.email },
    });
    if (!localBuyer) {
      const socialBuyer = await this.socialBuyerRepository.findOne({
        where: { email: user.email },
      });
      if (!socialBuyer) return "잘못된 유저정보 입니다.";
      return socialBuyer;
    }
    return localBuyer;
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
