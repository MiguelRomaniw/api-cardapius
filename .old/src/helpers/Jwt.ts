import { UserRoles } from "Src/types/UserRoles";
import { Request } from "express";
import jwt from "jsonwebtoken";

type RequestKey = Required<Request>;
type AuthKey = Omit<RequestKey["auth"], "company" | "role">;

type JwtData = {
  id: string;
  role: UserRoles & AuthKey;
};

export class Jwt {
  public static tokenSecret = process.env.JWT_TOKEN_SECRET!;

  public static sign(payload: JwtData) {
    const token = jwt.sign(payload, this.tokenSecret);

    return token;
  }

  public static verify(token: string) {
    const data = jwt.verify(token, this.tokenSecret) as JwtData;

    return data;
  }
}
