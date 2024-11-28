import { Router } from "express";
import { router as publicRouter } from "./public";
import { router as masterRouter } from "./master";
import { router as managerRouter } from "./manager";
import { router as customerRouter } from "./customer";

export const router = Router({ strict: true });

router.use(publicRouter, masterRouter, managerRouter, customerRouter);
