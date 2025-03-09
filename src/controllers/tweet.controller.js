import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const userId = req.user?.id

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content for tweet is required")
    }

    const tweet = await Tweet.create({ content, owner: userId })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet created successfully"
            )
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 })

    if (tweets.length === 0) {
        throw new ApiError(404, "No tweets found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "Tweets fetched successfully"
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?.id
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== userId) {
        throw new ApiError(400, "User not alowed to update tweet")
    }

    tweet.content = content
    await tweet.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated successfully"
            )
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?.id

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found while deleting")
    }

    if (tweet.owner.toString() !== userId) {
        throw new ApiError(403, "User not allowed to delete tweet")
    }

    await tweet.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Tweet deleted successfully"
            )
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}