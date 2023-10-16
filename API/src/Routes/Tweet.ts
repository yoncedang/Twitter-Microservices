import { Router } from "express";
import { Middleware } from "../Middleware/Middleware";
import { Tweet } from "../Controller/Tweet";
import multer from "multer";

import {
     validateTweet,
     validateDelete,
     validateEditORetweet,
     validate_Tweet,
     validate_nav,
     validate_findcontent,
     validate_Search,
} from "../Middleware/Validator";
import { Request, Response } from "express";


class Tweet_Routes {
     private tweet: Tweet;
     private middleware: Middleware;
     public router: Router;
     private upload: multer.Multer;
     constructor() {
          this.tweet = new Tweet();
          this.middleware = new Middleware();
          this.upload = multer({ storage: multer.memoryStorage(), });
          this.router = Router();
          this.Create_Tweet();
          this.Delete_Tweet();
          this.Edit_Tweet();
          this.ReTweet();
          this.Un_Retweet();
          this.GET_tweet_ID();
          this.NAV_tweet();
          this.Search_by_Content();

     }


     private async Create_Tweet() {
          this.router.post("/create", validateTweet, this.upload.array('file'), this.middleware.LOGIC_UPLOAD, this.middleware.CREATE_TWEET, this.tweet.CREATE_TWEET);
     }

     private async Delete_Tweet() {
          this.router.delete("/delete", validateDelete, this.middleware.DELETE_TWEET, this.tweet.DELETE_TWEET);
     }

     private async Edit_Tweet() {
          this.router.put("/edit", validateEditORetweet, this.upload.array('file'), this.middleware.ROLE_USER, this.middleware.EDIT_UPLOAD, this.middleware.EDIT_TWEET, this.tweet.EDIT_TWEET);
     }

     private async ReTweet() {
          this.router.post("/retweet", validateEditORetweet, this.middleware.RETWEET, this.tweet.RE_TWEET);
     }

     private async Un_Retweet() {
          this.router.put("/un-retweet", validateEditORetweet, this.middleware.UN_RETWEET, this.tweet.UN_RETWEET);
     }

     private async GET_tweet_ID() {
          this.router.get("/get-tweet", validate_Tweet, this.middleware.GET_TWEET_BY_ID, this.tweet.GET_TWEET_BY_ID);
     }

     private async NAV_tweet() {
          this.router.get("/pagination-tweet", validate_nav, this.middleware.NAV_TWEET, this.tweet.NAV_TWEET);
     }

     private async Search_by_Content() {
          this.router.get("/elasticsearch-tweet", validate_findcontent, this.middleware.Search_by_Content, this.tweet.Search_by_Content);
     }



}

export {
     Tweet_Routes
}