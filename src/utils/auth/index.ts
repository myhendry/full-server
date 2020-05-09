import jwt, { sign } from "jsonwebtoken";

import { User } from "../../entity/User";
import { ENV } from "../../settings/envVariables";

export const createAccessToken = (user: User): string => {
  return sign({ userId: user.id, email: user.email }, ENV.JWT_SECRET_KEY!);
};

export const isTokenValid = async (token: string) => {
  if (token) {
    const result = new Promise((resolve, __) => {
      jwt.verify(token, ENV.JWT_SECRET_KEY!, (error: any, decoded: any) => {
        if (error) {
          resolve({ error });
        }
        if (decoded) {
          resolve({ decoded });
        }
      });
    });

    return result;
  }

  return { error: "No token provided" };
};
