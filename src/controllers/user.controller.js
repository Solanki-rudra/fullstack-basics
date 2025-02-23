import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler( async(req,res)=>{
    const { username, email, fullName, password } = req.body;

    if([username, email, fullName, password].some(field=>field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409, "username or email already exists")
    }
    
    const avatarFileLocalPath = req.files?.avatar[0]?.path;
    const coverImgFileLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarFileLocalPath){
        throw new ApiError(400, "Avatar field is required")
    }

    const avatar = await uploadOnCloudinary(avatarFileLocalPath)
    const coverImage = await uploadOnCloudinary(coverImgFileLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        email,
        username:username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})