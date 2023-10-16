

import { Router } from "express";
import { Middleware } from "../Middleware/Middleware";
import { Auth } from "../Controller/Auth";
import multer from "multer";
import {

     validateSignup,
     validateVerifyEmail,
     validateVerifyOTP,
     validateRequestVerification,
     validateForgotPassword,
     validateResetPassword,
     validateLogin,
     validateRefreshtoken,
     validateChangePassword,
     validateChangeEmail,
     validateChange,
     validateGetInformation,
     validateDeleteAccount,
     validateSuspendAccount,
     validateUnsuspendAccount,
     validateGetAllUser,
     validateLogout,
     validateAvatar,
     validateGetUser,
     validateEditProfile,
     validate_Search,
     validate_User,
} from "../Middleware/Validator";

import { Request, Response } from "express";


class Routes {
     private auth: Auth;
     private middleware: Middleware;
     public router: Router;
     private upload: multer.Multer;
     constructor() {
          this.auth = new Auth();
          this.middleware = new Middleware();
          this.router = Router();
          this.upload = multer({ storage: multer.memoryStorage() });
          this.signup();
          this.verification();
          this.verification_otp();
          this.request_verification();
          this.forgot_password();
          this.reset_password();
          this.login();
          this.request_token();
          this.change_password();
          this.edit_profile();
          this.change_email();
          this.verify_change_email();
          this.get_information();
          this.del_account();
          this.suspend_account();
          this.unsuspend_account();
          this.all_user();
          this.logout();
          this.updateAvatar();
          this.get_USERNAME();
          this.Search();
          this.Get_User_By_ID();
     }



     private async signup(): Promise<void> {
          this.router.post('/auth/signup', validateSignup, this.middleware.SIGNUP, this.auth.SIGNUP_CONSUME)
     }
     private async verification(): Promise<void> {
          this.router.get('/auth/verify-email', validateVerifyEmail, this.middleware.VERIFY_EMAIL, this.auth.VERIFY_EMAIL)
     }
     private async verification_otp(): Promise<void> {
          this.router.post('/auth/verify-otp', validateVerifyOTP, this.middleware.VERIFY_OTP, this.auth.VERIFY_OTP)
     }
     private async request_verification(): Promise<void> {
          this.router.get('/auth/request-verification', validateRequestVerification, this.middleware.REQUEST_VERIFICATION, this.auth.REQUEST_VERIFICATION)
     }
     private async forgot_password(): Promise<void> {
          this.router.post('/auth/forgot-password', validateForgotPassword, this.middleware.FORGOT_PASSWORD, this.auth.FORGOT_PASSWORD)
     }
     private async reset_password(): Promise<void> {
          this.router.post('/auth/reset-forgot-password', validateResetPassword, this.middleware.RESET_PASSWORD, this.auth.RESET_PASSWORD)
     }
     private async login(): Promise<void> {
          this.router.post('/auth/login', validateLogin, this.middleware.LOGIN, this.auth.LOGIN_ACCOUNT)
     }
     private async request_token(): Promise<void> {
          this.router.post('/auth/request-accesstoken', validateRefreshtoken, this.auth.REQUEST_ACCESSTOKEN)
     }
     private async change_password(): Promise<void> {
          this.router.post('/auth/change-password', validateChangePassword, this.middleware.CHANGE_PASSWORD, this.auth.CHANGE_PASSWORD)
     }
     private async edit_profile(): Promise<void> {
          this.router.put('/auth/edit-profile', validateEditProfile, this.middleware.UPDATE_PROFILE, this.auth.UPDATE_PROFILE)
     }
     private async change_email(): Promise<void> {
          this.router.post('/auth/change-email', validateChangeEmail, this.middleware.CHANGE_EMAIL, this.auth.CHANGE_EMAIL)
     }
     private async verify_change_email(): Promise<void> {
          this.router.get('/auth/confirm-change-email', validateChange, this.middleware.VERIFY_CHANGE_EMAIL, this.auth.VERIFY_CHANGE_EMAIL)
     }
     private async get_information(): Promise<void> {
          this.router.get('/auth/get-information', validateGetInformation, this.middleware.GET_USER, this.auth.GET_USER)
     }
     private async del_account(): Promise<void> {
          this.router.delete('/auth/del-account', validateDeleteAccount, this.middleware.DEL_USER, this.auth.DEL_USER)
     }
     private async suspend_account(): Promise<void> {
          this.router.put('/auth/suspend-account', validateSuspendAccount, this.middleware.SUSPENDED_USER, this.auth.SUSPENDED_USER)
     }
     private async unsuspend_account(): Promise<void> {
          this.router.put('/auth/unsuspend-account', validateUnsuspendAccount, this.middleware.UNSUSPENDED_USER, this.auth.UNSUSPENDED_USER)
     }
     private async all_user(): Promise<void> {
          this.router.get('/auth/all-user', validateGetAllUser, this.middleware.ALL_USER, this.auth.GET_ALL_USER)
     }
     private async logout(): Promise<void> {
          this.router.get('/auth/logout', validateLogout, this.middleware.LOGOUT, this.auth.LOGOUT)
     }
     private async updateAvatar(): Promise<void> {
          this.router.put('/auth/set-avatar', validateAvatar, this.upload.array('file'), this.middleware.SET_AVATAR, this.auth.SET_AVATAR)
     }
     private async get_USERNAME(): Promise<void> {
          this.router.get('/auth/get-user', validateGetUser, this.middleware.GET_USERNAME, this.auth.GET_USERNAME)
     }
     private async Search() {
          this.router.get("/search/elasticsearch", validate_Search, this.middleware.elasticSearch, this.auth.elasticSearch);
     }
     private async Get_User_By_ID() {
          this.router.get("/auth/get-user-by-id", validate_User, this.middleware.GET_USER_BY_ID, this.auth.GET_USER_BY_ID);
     }
}

export {
     Routes
}