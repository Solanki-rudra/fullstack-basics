import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let { page = 1, limit = 10 } = req.query

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video is not available")
    }

    page = parseInt(page)
    limit = parseInt(limit)

    const comments = await Comment.find({ videoId })
        .populate("owner", "username email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Gets comments successfully"
            )
        )
})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params
    const owner = req.user?.id

    if (!content?.trim()) {
        throw new ApiError(400, "Comment's content is required")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const newComments = await Comment.create({
        content,
        video: videoId,
        owner
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newComments,
                "Comment add successfully"
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        const userId = req.user?.id

        if (!content?.trim()) {
            throw new ApiError(400, "Updated comment is required")
        }

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new ApiError(400, "Invalid comment id")
        }

        const comment = Comment.findById(commentId)

        if (!comment) {
            throw new ApiError(404, "Comment not found")
        }

        if (comment.owner.toString() !== userId) {
            throw new ApiError(403, "You're not allowed to update comment")
        }

        Comment.content = content
        await Comment.save()

        return res
            .status(200)
            .json(
                200,
                comment,
                "Comment updated successfully"
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Error while updating comment")
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?.id

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== userId) {
        throw new ApiError(400, "You're not allowed to delete comment")
    }

    await Comment.deleteOne({ _id: commentId })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Comment deleted successfully"
            )
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}