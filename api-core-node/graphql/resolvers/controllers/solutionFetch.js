import Solution from '../../../../models/core/Solution.js';

export const getSolutions = async (_, args) => {
  try {
    const { userId, page = 1, search = '', limit = 10 } = args;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const searchRegex = new RegExp(search, 'i'); // case-insensitive regex

    const query = {
      userId,
      isSubmitted:true
    };

    const skip = (page - 1) * limit;

    const solutions = await Solution.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit).populate('quizId');

    const count = await Solution.countDocuments(query);
    console.log(solutions)
    return {
      status: true,
      data: solutions,
      totalItems: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };

  } catch (error) {
    console.error('Error in getSolutions:', error);
    return {
      status: false,
      message: error.message || 'Failed to fetch solutions'
    };
  }
};
