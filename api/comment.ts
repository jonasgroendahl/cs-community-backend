import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth";

const prisma = new PrismaClient();

const app = Router();

app.use(authMiddleware).post("/comment", async (req, res) => {
  const { postId, content, title } = req.body;
  const { id } = res.locals.user;

  const comment = await prisma.comment.create({
    data: {
      title,
      content,
      postId,
      userId: id,
    },
  });

  res.json(comment);
});

export default app;
