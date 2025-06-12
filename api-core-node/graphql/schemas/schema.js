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
        category:String
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
        quizId: Quiz
        attemptNo: Int
        response: JSON       # Use a scalar to store Map-like data
        ufmAttempts: Int
        score: Int
        isSubmitted: Boolean
        createdAt:String
    }

    type SolutionPagination {
        status:Boolean
        data:[Solution]
        page:Int
        limit:Int
        totalItems:Int
        totalPages:Int
    }

    type UserSolution {
        solved:Boolean,
        solution: Solution,
        quiz:Quiz,
        message:String
    }

    type CategoryStats {
        average: Float
        attempted: Int
    }

    type SolutionStats {
        totalQuizSolutions: Int
        totalTestSolutions: Int
        aptitude: CategoryStats
        miscellaneous: CategoryStats
        core: CategoryStats
        ease: CategoryStats
        medium: CategoryStats
        hard: CategoryStats
    }

    type Rank {
        _id: ID
        userId: ID
        points: Int
        solutions: SolutionStats
        timestamp: String
    }
    type RankedUser {
        userId: ID
        name: String
        university: String
        points: Int
        rank: Int
    }

    type RankSummary {
        userId: ID
        university: String
        globalRank: Int
        universityRank: Int
        topGlobal: [RankedUser]
        topUniversity: [RankedUser]
        userRank:Rank
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
        ):UserSolution,
        getRank(
            userId: ID!, university: String!
        ):RankSummary,
        getSolutions(
            page: Int = 1,
            limit: Int = 10,
            search: String,
            userId: String!
        ):SolutionPagination
    }

`;