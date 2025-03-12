import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} from "../controllers/tweet.controller";

const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getUserTweets)
    .post(createTweet)

router
    .route("/:tweetId")
    .patch(updateTweet)
    .delete(deleteTweet)

export default router