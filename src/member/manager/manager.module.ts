import { Module } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manager } from "./entity/manager.entity";
import { ManagerController } from "./manager.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [TypeOrmModule, ManagerService],
})
export class ManagerModule {}
