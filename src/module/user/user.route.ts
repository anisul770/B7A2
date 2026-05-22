import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get('/',userController.getAllUser);


export const userRoute = router;