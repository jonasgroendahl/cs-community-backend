import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import postRoutes from "./api/post";
import userRoutes from "./api/user";
import commentRoutes from "./api/comment";
import "express-async-errors";

const prisma = new PrismaClient();
const app = express();

app.use(cors());

app.use(express.json());

app.use((req: express.Request, _, next: express.NextFunction) => {
  console.log(req.url, req.method, req.body);
  console.log("nexting", next);

  next();
});

app.use(postRoutes);
app.use(userRoutes);
//app.use(commentRoutes);

app.get("/hello", async (req, res) => {
  res.json({ message: "Hello" });
});

function errorHandler(
  err: express.ErrorRequestHandler,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log("caught an error");

  return next(err);
}

app.use(errorHandler);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
