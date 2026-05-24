import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import issueOwner from "../../middleware/issue.owner";

const router = Router();

router.post('/',auth(),issueController.createIssue);
router.get('/',issueController.getAllIssue);
router.get('/:id',issueController.getSingleIssue);
router.put('/:id',auth(),issueOwner(),issueController.updateIssue);
router.delete('/:id',auth(),issueController.deleteIssue);


export const issueRoute = router;