import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  alreadySignupException,
  notAllowedIDException,
  notFoundEmailException,
} from "../../shared/exception/exception.index";
import { User } from "../../shared/user/entity/user.entity";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";

class MockRepository {
  public async findOne(id: string): Promise<User> {
    if (id === "tester") {
      return new User();
    } else {
      return undefined;
    }
  }
}

class MockAuthService {
  public async checkAllowedId(id: string): Promise<void> {
    if (id === "allowId") {
      return;
    } else {
      throw notAllowedIDException;
    }
  }

  public async emailAuthentication(email: string): Promise<void> {
    switch (email) {
      case "notexistemail@gmail.com":
        throw notFoundEmailException;
      case "existpassword@gmail.com":
        throw alreadySignupException;
      default:
        return;
    }
  }
}

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("checkAllowedId", () => {
    it("should be allowed", () => {
      controller
        .checkAllowedId({ id: "allowId" })
        .then((res) => expect(res.message).toEqual("Allowed ID"))
        .catch(() => expect(1).toEqual(2));
    });

    it("should be not allowed", () => {
      controller
        .checkAllowedId({ id: "not allowed id" })
        .then(() => expect(1).toEqual(2))
        .catch((err) => {
          expect(err.getStatus()).toEqual(405);
          expect(err.message).toEqual("Not Allowed ID");
        });
    });
  });

  describe("emailAuthentication", () => {
    it("should throw not fount email error", () => {
      expect(
        controller.emailAuthentication({ email: "notexistemail@gmail.com" }),
      ).rejects.toEqual(notFoundEmailException);
    });
    it("should throw already signup error", () => {
      expect(
        controller.emailAuthentication({ email: "existpassword@gmail.com" }),
      ).rejects.toEqual(alreadySignupException);
    });
    it("shoul success test", () => {
      expect(
        controller.emailAuthentication({ email: "existemail@gmail.com" }),
      ).resolves.toEqual({ meessage: "success" });
    });
  });
});
