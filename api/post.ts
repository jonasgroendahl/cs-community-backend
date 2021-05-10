import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth";

const prisma = new PrismaClient();

const app = Router();

app.get("/post", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      Like: true,
    },
  });

  return res.status(200).json(posts);
});

app.get("/post/:id", async (req, res) => {
  const post = await prisma.post.findFirst({
    include: {
      comments: true,
      author: true,
    },
    where: {
      id: parseInt(req.params.id, 10),
    },
  });

  return res.status(200).json(post);
});

app.get("/me/post", authMiddleware, async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      id: res.locals.user.id,
    },
  });

  return res.status(200).json(posts);
});

app.post("/post", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  const { id, email } = res.locals.user;

  console.log("user", id, email);

  console.log("body", title, content);

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id,
        },
      },
    },
  });

  console.log("created a post", post);

  return res.status(200).json(post);
});

app.post("/post/like", async (req, res) => {
  const { postId, userId } = req.body;
  const exists = await prisma.like.findMany({
    where: {
      postId,
      userId,
    },
  });

  console.log("exists", exists);

  if (exists.length > 0) {
    return res.status(400);
  }

  const liked = await prisma.like.create({
    data: {
      postId: req.body.postId,
      userId: req.body.userId,
    },
  });
  return res.status(200).json(liked);
});

app.post("/post/dislike", async (req, res) => {
  const liked = await prisma.like.deleteMany({
    where: {
      postId: req.body.postId,
      userId: req.body.userId,
    },
  });
  if (liked) {
    return res.status(200).json(liked);
  }
  return res.status(400);
});

export default app;
