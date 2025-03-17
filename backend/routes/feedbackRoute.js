import express from "express";
import { addfeedback, approveFeedback, deleteFeedback, getAllFeedback, getApprovedFeedback, getApprovedFeedbackCount, rejectFeedback } from "../controllers/feedbackController.js";


const feedbackRouter = express.Router();


feedbackRouter.post("/", addfeedback);

feedbackRouter.put('/feedback/approve/:feedbackId', approveFeedback);

feedbackRouter.put('/feedback/reject/:feedbackId', rejectFeedback);

feedbackRouter.delete('/feedback/:feedbackId', deleteFeedback);

feedbackRouter.get('/feedback/all', getAllFeedback);

feedbackRouter.get('/feedback/approved', getApprovedFeedback);

feedbackRouter.get('/feedback/approved/count', getApprovedFeedbackCount);


export default feedbackRouter;