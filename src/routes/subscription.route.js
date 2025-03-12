import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controller";

const router = Router()

router.use(verifyJWT)

router.route('/u/:subscriberId').get(getSubscribedChannels)

router
    .route('/c/:channelId')
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)

export default router