import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IUserReqeust } from "src/shared/user/interface/user-request.interface";
import { ConsumerService } from "./consumer.service";
import {
  RegistrationDto,
  RegistrationResponseData,
} from "./dto/registration.dto";
import { urlDto } from "./dto/url.dto";
import { Consumer } from "./entity/consumer.entity";

@Controller("consumer")
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("registration")
  public async registration(
    @Body() dto: RegistrationDto,
    @Req() req: IUserReqeust
  ): Promise<RegistrationResponseData> {
    return await this.consumerService.registration(dto, req.user.user_identity);
  }

  @Get("list")
  public async list(): Promise<Consumer[]> {
    return await this.consumerService.list();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("url")
  public async addConsumerRedirectUrl(
    @Body() dto: urlDto,
  ): Promise<{ message: string }> {
    await this.consumerService.addConsumerRedirectUrl(dto);
    return { message: "success" };
  }
}
