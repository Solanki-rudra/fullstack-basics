import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "created_at",
        sortType = 'desc',
        userId
    } = req.query;

    let filter = {};
    if (query) {
        filter = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
    }

    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const videos = await Video.aggregate([
        { $match: filter },
        { $sort: { [sortBy]: sortType === 'desc' ? -1 : 1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit, 10) }  // Ensure limit is an integer
    ]);

    if (videos.length === 0) {
        throw new ApiError(404, "Videos not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Videos retrieved successfully"
            )
        );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title?.trim()) {
        throw new ApiError(400, "Title is required")
    }

    if (!description?.trim()) {
        throw new ApiError(400, "Description is required")
    }

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    const videoLocalPath = req.files?.video && req.files?.video[0].path

    const thumbnailLocalPath = req.files?.thumbnail && req.files?.thumbnail[0].path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video field is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail field is required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload || !videoUpload?.url) {
        throw new ApiError(400, "Failed to upload video file")
    }

    if (!thumbnailUpload || !thumbnailUpload?.url) {
        throw new ApiError(400, "Failed to upload thumbnail file")
    }

    const video = await Video.create({
        title,
        description,
        duration: videoUpload.duration,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        owner: userId,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                video,
                "Video published successfully"
            )
        );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId).populate("owner", "name email");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video retrieved successfully"
            )
        );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findOne({ _id: videoId, owner: userId });

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.title = title || video.title;
    video.description = description || video.description;

    if (req?.file && req?.file?.path) {
        const thumbnailUpload = await uploadOnCloudinary(req?.file?.path);
        video.thumbnail = thumbnailUpload.url;
    }

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video updated successfully"
            )
        );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?.id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    await Video.deleteOne({ _id: videoId, owner: userId })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deleted: true },
                "Video deleted successfully"
            )
        );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?.id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }

    const video = await Video.findOne({ _id: videoId, owner: userId });

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video publish status toggled"
            )
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}