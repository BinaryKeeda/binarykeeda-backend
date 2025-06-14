import { TestResponse } from "../../../../models/test/TestResponse.js";
import { Test } from "../../../../models/test/TestSchema.js";

export const getUserTestSolution = async (_, args) => {
  const { slug, userId, isPractice } = args;

  const test = await fetchTestBySlug(slug);
  if (!test) throw new Error("Test not found");

  let testResponse = await fetchUserTestSolution(userId, test._id);

  // If not exists, create new TestResponse with section references
  if (!testResponse) {
    const sectionAnswers = test.sections.map(section => ({
      sectionId: section._id
    }));

    testResponse = await TestResponse.create({
      testId: test._id,
      userId,
      sections: sectionAnswers
    });
  }

  // Format codingAnswers and quizAnswers maps into arrays
   const formattedSections = (testResponse.response || []).map(section => {
        const quizMap = section?.quizAnswers?.[0] || new Map();
        const codingMap = section?.codingAnswers?.[0] || new Map();
        const quizAnswers = Object.entries(quizMap).map(([questionId, answerText]) => ({
            id: questionId,
            selectedOption: Array.isArray(answerText) ? answerText : [answerText]
        }));

        // console.log(codingMap)
        const codingAnswers = Object.entries(codingMap).map(([problemId, userSolutionId]) => ({
            problemId: problemId,
            // userSolutionId
        }));

        return {
            sectionId: section.sectionId,
            sectionType: section.sectionType,
            quizAnswers,
            codingAnswers,
            totalQuestions: section.totalQuestions ?? 0,
            correctAnswers: section.correctAnswers ?? 0
        };
    });



  return {
    test,
    testResponse: {
      ...testResponse.toObject(),
      response: formattedSections
    }
  };
};

// ========== Helper Functions ==========

const fetchTestBySlug = (slug) => {
  return Test.findOne({ slug })
    .populate({ path: "sections.problemset" })
    .then(test => test)
    .catch(err => {
      throw new Error("Error fetching test: " + err.message);
    });
};

const fetchUserTestSolution = (userId, testId) => {
  return TestResponse.findOne({ userId, testId })
    .then(data => data)
    .catch(err => {
      throw new Error("Error fetching test response: " + err.message);
    });
};
