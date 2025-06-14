import { Router } from "express";
import { TestResponse } from "../../models/test/TestResponse.js";
import { Test } from "../../models/test/TestSchema.js";

const testRouter = Router();


testRouter.post('/start' , async (req,res) => {
    try{
        const {submissionId} = req.body;
      

        const updatedSubmission = await TestResponse.findByIdAndUpdate(
            submissionId,
            {
                $set: {
                startedAt: Date.now(),
                hasAgreed: true
                }
            },
            { new: true }
        );
        // await updatedSubmission.save();
        res.status(200).json({message : "Test started successfully"});
    }catch (error) {
        res.status(400).json({message : "Failed to start test"});
    }
})

testRouter.post('/submit-section' , async (req,res) => {
    try{
        const {testResponseId , testSectionLength} = req.body;

        const submission = await TestResponse.findById(testResponseId);

        // const test = await Test.findById(testId);
        if(!submission){
            return res.status(404).json({message : "Test not found"});
        }
        submission.curr++;
        if (submission.curr >= testSectionLength) {
            submission.isSubmitted = true;
        }    
        await submission.save();
        res.status(200).json({message : "Section submitted successfully" ,  isSubmitted:submission.isSubmitted});
    }catch(e) {
        res.status(400).json({message : "Failed to submit section" });
    }
})
// testRouter.post('/')
export default testRouter;