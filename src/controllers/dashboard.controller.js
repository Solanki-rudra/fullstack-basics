import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "likes",
                foreignField: "video",
                localField: "_id",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: {
                    $sum: 1
                },
                totalViews: {
                    $sum: "$views"
                },
                totalLikes: {
                    $sum: {
                        $size: "$likes"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalLikes: 1,
                totalVideos: 1,
                totalViews: 1
            }
        }
    ]);
console.log(videos)
    if (!videos.length) {
        throw new ApiError(400, "Videos not found for views and count");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: {$sum:1}
            }
        },
        {
            $project: {
                _id: 0,
                totalSubscribers: 1
            }
        }
    ]);

    console.log(subscribers)

    // if (!subscribers.length) {
    //     throw new ApiError(400, "Subscribers not found for count");
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalVideos: videos[0]?.totalVideos,
                    totalViews: videos[0]?.totalViews,
                    totalLikes: videos[0]?.totalLikes,
                    totalSubscribers: subscribers[0]?.totalSubscribers || 0
                },
                "Channel stats retrieved successfully"
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    const videos = await Video.find({ owner: channelId });

    if(!videos?.length){
        throw new ApiError(404, "No videos found for this channel")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Channel videos retrieved successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}