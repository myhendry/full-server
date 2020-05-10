import { Request, Response } from "express";

const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { Strategy: GoogleTokenStrategy } = require("passport-google-token");

const { ENV } = require("../../settings/envVariables");

// FACEBOOK STRATEGY
const FacebookTokenStrategyCallback = (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) =>
  done(null, {
    accessToken,
    refreshToken,
    profile,
  });

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: `${ENV.FACEBOOK_APP_ID}`,
      clientSecret: `${ENV.FACEBOOK_APP_SECRET}`,
    },
    FacebookTokenStrategyCallback
  )
);

// GOOGLE STRATEGY
const GoogleTokenStrategyCallback = (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) =>
  done(null, {
    accessToken,
    refreshToken,
    profile,
  });

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: "your-google-client-id",
      clientSecret: "your-google-client-secret",
    },
    GoogleTokenStrategyCallback
  )
);

// authenticate function
const authenticateFacebook = (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "facebook-token",
      { session: false },
      (err: any, data: any, info: any) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });

const authenticateGoogle = (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "google-token",
      { session: false },
      (err: any, data: any, info: any) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });

export { authenticateFacebook, authenticateGoogle };
