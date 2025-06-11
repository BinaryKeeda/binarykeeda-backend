
import Solution from '../../../../models/core/Solution.js';
import Quiz from '../../../../models/core/Quiz.js';
import mongoose from 'mongoose';
export const getUserQuizes = async (_, args) => {
      try {
        const page = Math.max(args.page || 1, 1);
        const limit = Math.min(args.limit || 10, 100);
        const skip = (page - 1) * limit;
        const search = args.search || '';
        const category = args.category || '';
        const userId = args.userId;

        if (!userId) {
          throw new Error('User ID is required');
        }

        const queryFilter = {
          ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
          ...(category ? { category } : {})
        };

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const result = await Quiz.aggregate([
          { $match: queryFilter },
          {
            $facet: {
              data: [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                  $lookup: {
                    from: 'solutions',
                    let: { quizId: '$_id' },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ['$quizId', '$$quizId'] },
                              { $eq: ['$userId', userObjectId] },
                              { $eq: ['$isSubmitted', true] }
                            ]
                          }
                        }
                      },
                      { $sort: { createdAt: -1 } }
                    ],
                    as: 'userSolutions'
                  }
                },
                {
                  $addFields: {
                    hasAttempted: { $gt: [{ $size: '$userSolutions' }, 0] },
                    totalAttempts: { $size: '$userSolutions' }
                  }
                },
                {
                  $project: {
                    userSolutions: 0,
                    questions: 0
                  }
                }
              ],
              totalCount: [
                { $match: queryFilter },
                { $count: 'count' }
              ]
            }
          }
        ]);

        const quizzes = result[0].data;
        const totalItems = result[0].totalCount[0]?.count || 0;

        return {
          status: true,
          data: quizzes,
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit)
        };
      } catch (error) {
        throw new Error('Failed to fetch quizzes');
      }
    }


export const getUserSolution = async (_,args) => {


    const {slug , userId} = args; 
    try {
        if(!userId || !slug) {
            throw new Error('Missing Credentials');
        }
        const quiz = await Quiz.findOne({slug});
        if (!quiz && userId) {
            throw new Error('Quiz not found');
        }
        const userSolution = await Solution.findOne({quizId:quiz._id, userId});
        if(userSolution?.isSubmitted) {
            return {
                solved:true,
                solution: userSolution,
                message: 'Solution submitted'
            }
        }
        else if(!userSolution){
            const newSolution = new Solution({
                quizId: quiz._id,
                userId,
                isSubmitted: false,
                attemptNo:1
                });
            await newSolution.save();
            return {
                solved:false,
                solution: newSolution,
                quiz:quiz,
                message: 'Solution created'
            }
        }
        else{
            return {
                solved:false,
                solution: userSolution,
                quiz:quiz,
                message: 'Solution exists'
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch user solution');
    }
}