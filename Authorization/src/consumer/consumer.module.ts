import { Module } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";
import { ConsumerController } from "./consumer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsumersRepository } from "./entity/consumer.repository";
import { UserRepository } from "../shared/user/entity/user.repository";
import { JwtStrategy } from "../shared/jwt/passport/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumersRepository, UserRepository]),
    JwtStrategy,
  ],
  providers: [ConsumerService],
  controllers: [ConsumerController],
})
export class ConsumerModule {}
