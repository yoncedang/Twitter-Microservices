import { Router } from "express";
import { Middleware } from "../Middleware/Middleware";
import { Follow } from "../Controller/Follow";


import {
     followValidate,
     unfollowValidate,
     validateAllfollow,

} from "../Middleware/Validator";
import { Request, Response } from "express";


class Follow_Routes {
     private follow: Follow;
     private middleware: Middleware;
     public router: Router;

     constructor() {
          this.follow = new Follow();
          this.middleware = new Middleware();
          this.router = Router();
          this.follow_user();
          this.unfollow_user();
          this.get_follow();
          this.get_following();
     }


     private async follow_user() {
          this.router.post("/follow-user", followValidate, this.middleware.FOLLOW_USER, this.follow.FOLLOW_USER);
     }
     private async unfollow_user() {
          this.router.post("/unfollow-user", unfollowValidate, this.middleware.UNFOLLOW_USER, this.follow.UNFOLLOW_USER);
     }
     private async get_follow() {
          this.router.get("/follower", validateAllfollow, this.middleware.ALL_FOLLOW_USER, this.follow.ALL_FOLLOW);
     }
     private async get_following() {
          this.router.get("/following", validateAllfollow, this.middleware.ALL_FOLLOWING_USER, this.follow.ALL_FOLLOWING);
     }
}

export {
     Follow_Routes
}