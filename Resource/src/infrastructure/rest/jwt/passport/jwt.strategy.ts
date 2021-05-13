import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UnauthorizedTokenException } from "../../../../domain/unauthorized-token.error";
import { IJwtPayload } from "../interface/jwt-payload.interface";
import { JWT_SECRET_KEY } from "../jwt.constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  public async validate(payload: IJwtPayload) {
    if (payload.type !== "access") {
      throw UnauthorizedTokenException;
    }
    return payload;
  }
}
