import { Router } from "express";
import { chatWithAi } from "../controllers/googleAi.controller.js";

const router=Router()

router.get('/',chatWithAi)

export default router