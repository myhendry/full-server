import { AuthenticationError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

import { isTokenValid } from "./../../utils/auth";
import { ContextType } from "../../types/ContextType";

export const isAuth: MiddlewareFn<ContextType> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new AuthenticationError("Not Authenticated");
  }

  const [, token] = authorization.split(" ");

  const { error, decoded }: any = await isTokenValid(token);

  if (error) {
    throw new AuthenticationError("Invalid Token! Access Denied");
  }

  context.payload = decoded as any;

  return next();
};
