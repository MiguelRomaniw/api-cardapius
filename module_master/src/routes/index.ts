import { UserController } from "Src/controllers";
import { Router } from "express";

export const router = Router();

router.get("/users", UserController.index);
router.get("/users/:id", UserController.show);

router.get("/", async (request, response) => {
  return response.send("Hello, world!");
});
