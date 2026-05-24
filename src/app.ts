import express, { type Application, type Request, type Response } from "express"
import { authRoute } from "./module/auth/auth.route";
import { userRoute } from "./module/user/user.route";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { issueRoute } from "./module/issue/issue.route";

const app:Application = express();

app.use(express.json());
app.use(logger());

app.get('/',(req:Request,res:Response)=>{
  res.status(200).json({
    message:"Welcome to DevPulse",
    author : "Anisul Haque"
  });
});

app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/issues',issueRoute);
app.use(globalErrorHandler);

export default app;