import "reflect-metadata";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import compression from "compression";
import depthLimit from "graphql-depth-limit";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions,
} from "typeorm";

import { ENV } from "./settings/envVariables";
import "../ormconfig";
import { UserResolver } from "./modules/User";
import { BookResolver } from "./modules/Book";
import { TodoResolver } from "./modules/Todo";

(async () => {
  console.log("CURRENT ENV: ", process.env.NODE_ENV);

  //* Express Middlewares
  const app = express();

  app.use(compression());
  app.use(
    cors({
      origin: "http://localhost:8000",
      credentials: true,
    })
  );
  app.use(cookieParser());

  //* Postgres DB Setup
  let connectionOptions: ConnectionOptions;

  if (process.env.NODE_ENV === "development") {
    const connection = await getConnectionOptions("development");
    connectionOptions = { ...connection, name: "default" };
  } else if (process.env.NODE_ENV === "dockerized") {
    const connection = await getConnectionOptions("dockerized");
    connectionOptions = { ...connection, name: "default" };
  } else {
    connectionOptions = await getConnectionOptions("default");
  }
  await createConnection(connectionOptions);

  //* Apollo Server Setup
  const apolloServer = new ApolloServer({
    playground: true,
    introspection: true,
    validationRules: [depthLimit(7)],
    schema: await buildSchema({
      resolvers: [TodoResolver, BookResolver, UserResolver],
      dateScalarMode: "isoDate",
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    }),
    context: async ({ req, res }) => ({
      req,
      res,
    }),
  });

  //* Servers Setup
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  const PORT = process.env.PORT || ENV.NODE_SERVER;

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });
})();
