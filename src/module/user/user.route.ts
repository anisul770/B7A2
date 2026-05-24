import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/',auth(),userController.getAllUser);


export const userRoute = router;