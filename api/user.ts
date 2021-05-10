import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = Router();

app.post("/user/login", async (req, res) => {
  console.log("logging in");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing params" });
  }

  const user = await prisma.user.findFirst({
    where: {
      AND: [
        {
          email: {
            equals: email,
          },
          password: {
            equals: password,
          },
        },
      ],
    },
  });

  const allUsers = await prisma.user.findMany();

  console.log(allUsers);

  console.log(user, email, password);

  if (user) {
    return res.status(200).json({
      accessToken: user,
    });
  } else {
    return res.status(400).json({
      message: "Invalid password or username",
    });
  }
});

app.post("/user", async (req, res) => {
  const { email, password, name, image } = req.body;

  if (!password || !email || !name) {
    res.status(400).json({
      message: "Missing parameters",
    });
  }

  const user = await prisma.user.create({
    data: {
      email,
      image,
      password,
      name,
    },
  });

  return res.json(user);
});

export default app;
