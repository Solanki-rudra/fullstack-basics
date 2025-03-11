import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const userId = req.user?.id

    if(!name?.trim()){
        throw new ApiError(400, "Name is required")
    }

    if(!description?.trim()){
        throw new ApiError(400, "Description is required")
    }
    
    if(!userId){
        throw new ApiError(400, "Invalid user id")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:userId
    })

    if(!playlist){
        throw new ApiError(400, "Error while creating playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist created successfully"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if(isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.find({owner: userId})

    if(playlists.length === 0){
        throw new ApiError(404, "No playlists found for this user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "Playlists retrived successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist retreived successfully"
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    if(isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{videos:videoId}
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(400, "Error while adding video to playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added to playlist successfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    if(isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{videos:videoId}
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(400, "Error while removing video from playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video removed from playlist successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    await Playlist.deleteOne({_id: playlistId})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {deleted: true},
            "Playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.name = name || playlist.name
    playlist.description = description || playlist.description

    playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist updated successfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}