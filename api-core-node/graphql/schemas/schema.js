export const schema = `#graphql

    type Options {
        _id:ID
        text: String,
        image: String,
        isCorrect:Boolean
    }
    type Question {
        _id: ID!
        question:String
        marks:Int
        negative:Int
        image:String
        options:[Options]
    }
    type FunctionSignature {
        language: String!
        signature: String!
    }

    type Example {
        input: JSON!
        output: JSON!
        explanation: String
    }

    type TestCase {
        input: String!
        output: String!
        explanation: String
    }

    type PerformanceStats {
        bestTime: Float
        bestMemory: Float
        averageTime: Float
        averageMemory: Float
    }

    scalar JSON

    type Problem {
        _id: ID!
        title: String!
        description: String!
        difficulty: String!
        constraints: [String]
        topics: [String]
        hints: [String]
        examples: [Example]
        functionSignature: [FunctionSignature]
        testCases: [TestCase]
        performanceStats: PerformanceStats
        author: String
        createdAt: String
        updatedAt: String
        tags: [String]
        visibility: String
        submissionCount: Int
        acceptanceRate: Float
    }

    type Section {
        name: String!
        description: String
        sectionType: String
        questionSet: [Question]
        problemset: [Problem]
    }

    type Test {
        _id: ID!
        name: String!
        description: String
        duration: Int
        category: String
        isAvailable: Boolean
        sections: [Section]
        attempts:Int
    }

   type Quiz {
        _id: ID
        title: String
        category: String
        difficulty: String
        duration: Int
        marks: Int
        questions:[Question]
        minimumScore: Int
        averageScore: Int
        highestScore: Int
        totalAttempts: Int
        hasAttempted:Int
        isAvailable: Boolean
        isSubmitted: Boolean
        slug:String
        createdAt:String
    }

    type QuizPagination {
        status: Boolean!
        data: [Quiz!]!
        page: Int!
        limit: Int!
        totalItems: Int!
        totalPages: Int!
    }
    type TestPagination {
        status: Boolean
        data: [Test!]
        page: Int
        limit: Int
        totalItems: Int
        totalPages: Int
    }

    type ResponseEntry {
        selected: [String]
        answer: String
    }

    type Solution {
        _id: ID
        userId: ID
        quizId: ID
        attemptNo: Int
        response: JSON       # Use a scalar to store Map-like data
        ufmAttempts: Int
        score: Int
        isSubmitted: Boolean
        createdAt:String
    }


    type UserSolution {
        solved:Boolean,
        solution: Solution,
        quiz:Quiz,
        message:String
    }
    type Query {
        getQuizzes(
            page: Int = 1,
            limit: Int = 10,
            search: String,
            category: String,
            userId: String!
        ): QuizPagination! ,
        getTests(
            page: Int = 1,
            limit: Int = 10,
            search: String,
            category: String,
            userId: String!
        ): TestPagination!,
        getUserSolution(
            slug:String!,
            userId:String!
        ):UserSolution
    }

`;