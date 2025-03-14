import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?.id

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    if(!userId){
        throw new ApiError(400, "Invalid user")
    }

    const existingLike = await Like.findOne({video:videoId, likedBy:userId})

    if(existingLike){
        await Like.deleteOne({_id:existingLike._id})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {liked:false},
                "Like removed successfully"
            )
        )
    }

    await Like.create({
        video:videoId,
        likedBy:userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {liked:true},
            "Video liked successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?.id

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    if(!userId){
        throw new ApiError(400, "Invalid user")
    }

    const existingLikedComment = await Like.findOne({likedBy:userId,comment:commentId})

    if(existingLikedComment){
        await Like.deleteOne({_id:existingLikedComment._id})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {liked: false},
                "Comment disliked successfully"
            )
        )
    }

    await Like.create({
        likedBy:userId,
        comment:commentId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {liked: true},
            "Comment liked successfully"
        )
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?.id

    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    if(!userId){
        throw new ApiError(400, "Invalid user")
    }

    const existingLikedTweet = await Like.findOne({tweet:tweetId, likedBy:userId})

    if(existingLikedTweet){
        await Like.deleteOne({_id:existingLikedTweet._id})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {liked: false},
                "Tweet disliked successfully"
            )
        )
    }

    await Like.create({
        tweet:tweetId,
        likedBy:userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {liked: true},
            "Tweet liked successfully"
        )
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?.id

    if(!userId){
        throw new ApiError(400, "Invalid user id")
    }

    const likedVideos = await Like.find({
        likedBy:userId,
        video:{
            $exists:true
        }
    })
    .populate("video","title thumbnail description")
    .select("-tweet -comment")

    if(likedVideos.length === 0){
        throw new ApiError(404, "Liked videos not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked videos successfully fetched"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}