import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler( async(req,res)=>{
    const { username, email, fullName, password } = req.body;

    if(!username?.trim() || !email?.trim() || !fullName?.trim() || !password?.trim()){
        throw new ApiError(400, "All fields are required")
    }

    const existedUsername = await User.findOne({username})
    const existedEmail = await User.findOne({email})

    if(existedUsername){
        throw new ApiError(409, "username already exists")
    }

    if(existedEmail){
        throw new ApiError(409, "email already exists")
    }
    
    const avatarFileLocalPath = req.files?.avatar[0]?.path;
    let coverImgFileLocalPath;
    
    if(req.files?.coverImage){
        coverImgFileLocalPath = req.files?.coverImage[0]?.path;
    }

    if(!avatarFileLocalPath){
        throw new ApiError(400, "Avatar field is required")
    }

    const avatar = await uploadOnCloudinary(avatarFileLocalPath)
    const coverImage = await uploadOnCloudinary(coverImgFileLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        email,
        username:username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export const loginUser = asyncHandler( async(req,res) => {
    const { email, password } = req.body

    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, "Email is not available, Register first")
    }

    const isPasswordMatch = await user.isPasswordCorrect(password)

    if(!isPasswordMatch){
        throw new ApiError(409, "Incorrect password")
    }

    return res.status(201).json(
        new ApiResponse(200, user, "User login successfully")
    )
})
