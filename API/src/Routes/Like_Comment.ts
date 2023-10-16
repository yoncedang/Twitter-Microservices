import { Router } from "express";
import { Middleware } from "../Middleware/Middleware";
import { LIKE_COMMENT } from "../Controller/Like_Comment";


import {
     validateEditORetweet,
     validateTweet_Comment,
     validate_GetDel,
     validate_EditComment,
     valiedate_AllComment,

} from "../Middleware/Validator";
import { Request, Response } from "express";


class Like_Comment_Routes {
     private like_comment: LIKE_COMMENT;
     private middleware: Middleware;
     public router: Router;

     constructor() {
          this.like_comment = new LIKE_COMMENT();
          this.middleware = new Middleware();
          this.router = Router();
          this.LIKE_TWEET();
          this.unLIKE_TWEET();
          this.COMMENT_TWEET();
          this.GET_COMMENT_TWEET();
          this.DEL_COMMENT();
          this.EDIT_COMMENT();
          this.GET_ALL_COMMENT();
     }

     private async LIKE_TWEET() {
          this.router.post("/like", validateEditORetweet, this.middleware.LIKE_TWEET, this.like_comment.LIKE_TWEET);
     }
     private async unLIKE_TWEET() {
          this.router.delete("/unlike", validateEditORetweet, this.middleware.unLike_Tweet, this.like_comment.unLIKE_TWEET);
     }
     private async COMMENT_TWEET() {
          this.router.post("/comment", validateTweet_Comment, this.middleware.COMMENT_TWEET, this.like_comment.COMMENT_TWEET);
     }
     private async GET_COMMENT_TWEET() {
          this.router.get("/get-comment", validate_GetDel, this.middleware.GET_COMMENT, this.like_comment.GET_COMMENT);
     }
     private async DEL_COMMENT() {
          this.router.delete("/del-comment", validate_GetDel, this.middleware.DEL_COMMENT, this.like_comment.DEL_COMMENT);
     }
     private async EDIT_COMMENT() {
          this.router.put("/edit-comment", validate_EditComment, this.middleware.EDIT_COMMENT, this.like_comment.EDIT_COMMENT);
     }
     private async GET_ALL_COMMENT() {
          this.router.get("/all-comment-tweet", valiedate_AllComment, this.middleware.GET_ALL_COMMENT, this.like_comment.GET_ALL_COMMENT);
     }
}

export {
     Like_Comment_Routes
}