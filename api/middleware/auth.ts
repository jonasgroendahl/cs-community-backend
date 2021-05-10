import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

const getUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(userId, 10),
    },
  });

  return user;
};

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("authMiddleWare invoked", req.headers.authorization);

  if (req.headers.authorization === undefined) {
    return res.status(401).json({
      message: "Missing auth header",
    });
  }

  const user = await getUser(req.headers.authorization as string);

  if (!user) {
    return res.status(400).json({
      message: "User no longer exists",
    });
  }

  res.locals.user = user;

  next();
};
