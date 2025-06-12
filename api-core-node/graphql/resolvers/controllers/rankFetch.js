import mongoose from "mongoose";
import Rank from "../../../../models/profile/Rank.js";

export const getRank = async (_, { userId, university }) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Fetch user's own Rank doc
    const userRank = await Rank.findOne({ userId: objectId }).lean();
    if (!userRank) {
      throw new Error("User rank not found.");
    }

    // Global Rank of current user
    const [globalRankData] = await Rank.aggregate([
      {
        $setWindowFields: {
          sortBy: { points: -1 },
          output: { rank: { $rank: {} } }
        }
      },
      { $match: { userId: objectId } },
      { $project: { _id: 0, globalRank: "$rank" } }
    ]);

    // University Rank of current user
    const [universityRankData] = await Rank.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          $expr: {
            $eq: [
              { $toLower: "$user.university" },
              university.toLowerCase()
            ]
          }
        }
      },
      {
        $setWindowFields: {
          sortBy: { points: -1 },
          output: { rank: { $rank: {} } }
        }
      },
      { $match: { userId: objectId } },
      { $project: { _id: 0, universityRank: "$rank" } }
    ]);

    // Top 3 Global
    const topGlobal = await Rank.aggregate([
      {
        $setWindowFields: {
          sortBy: { points: -1 },
          output: { rank: { $rank: {} } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: 1,
          points: 1,
          rank: 1,
          name: "$user.name",
          university: "$user.university"
        }
      },
      { $match: { rank: { $lte: 3 } } },
      { $limit: 3 }
    ]);

    // Top 3 University
    const topUniversity = await Rank.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          $expr: {
            $eq: [
              { $toLower: "$user.university" },
              university.toLowerCase()
            ]
          }
        }
      },
      {
        $setWindowFields: {
          sortBy: { points: -1 },
          output: { rank: { $rank: {} } }
        }
      },
      {
        $project: {
          userId: 1,
          points: 1,
          rank: 1,
          name: "$user.name",
          university: "$user.university"
        }
      },
      { $match: { rank: { $lte: 3 } } },
      { $limit: 3 }
    ]);

    return {
      userId,
      university,
      globalRank: globalRankData?.globalRank ?? null,
      universityRank: universityRankData?.universityRank ?? null,
      topGlobal,
      topUniversity,
      userRank // new field containing the full user Rank document
    };
  } catch (err) {
    console.error("Error in getRank:", err);
    throw new Error("Failed to fetch rank summary.");
  }
};
