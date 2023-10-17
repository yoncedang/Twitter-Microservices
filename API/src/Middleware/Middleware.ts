

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RedisClass } from '../Redis/Redis';
import { Response_Clients } from '../Config/Response';
import { KafkaProducer } from '../Kafka/Producer';
import { PRODUCER, PRODUCER_FOLLOW, PRODUCER_TWEET } from '../Kafka/TOPIC';
import { Signup } from '../Interface/Interface';
import { validationResult } from 'express-validator';
import { Jsonwebtoken } from '../Config/JWT';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { DigitalOcean } from '../Config/Config';
import { app } from '../Config/Firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { KafkaConsumer } from '../Kafka/Consumer';

const consumer = new KafkaConsumer();
const { accessKeyId, secretAccessKey, endpoint, region, bucket } = DigitalOcean

const jwt = new Jsonwebtoken();
const response = new Response_Clients();
const redis = new RedisClass();
const kafkaProducer = new KafkaProducer();
const id = uuidv4();
const {
     PRODUCER_SIGNUP,
     VERIFICATION_FROM_API_TO_AUTH,
     VERIFICATION_OTP_FROM_API_TO_AUTH,
     REQUEST_VERIFICATION_FROM_API_TO_AUTH,
     FORGOT_PASSWORD_FROM_API_TO_AUTH,
     RESET_PASSWORD_FROM_API_TO_AUTH,
     LOGIN_FROM_API_TO_AUTH,
     CHANGE_PASSWORD_FROM_API_TO_AUTH,
     UPDATE_PROFILE_FROM_API_TO_AUTH,
     CHANGE_EMAIL_FROM_API_TO_AUTH,
     VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH,
     GET_USER_FROM_API_TO_AUTH,
     DEL_USER_FROM_API_TO_AUTH,
     SUSPENDED_USER_FROM_API_TO_AUTH,
     UNSUSPENDED_USER_FROM_API_TO_AUTH,
     ALL_USER_FROM_API_TO_AUTH,
     LOGOUT_FROM_API_TO_AUTH,
     SET_AVATAR_FROM_API_TO_AUTH,
     USERNAME_FROM_API_TO_AUTH,



} = PRODUCER;

const {
     FOLLOW_TOPIC,
     UNFOLLOW_TOPIC,
     GET_ALL_FOLLOW_TOPIC,
     GET_ALL_FOLLOWING_TOPIC,
     unLIKE_TWEET_TOPIC,


} = PRODUCER_FOLLOW



const {
     CREATE_TWEET_TOPIC,
     DELETE_TWEET_TOPIC_SERVICES,
     EDIT_TWEET_TOPIC,
     CHECK_TWEET,
     RETWEET_TOPIC,
     UNRETWEET_TOPIC,
     CHECK_TWEET_TOPIC,
     CHECK_TWEET_FOR_COMMENT_TOPIC,
     GET_COMMENT_TOPIC,
     DEL_COMMENT_TOPIC,
     EDIT_COMMENT_TOPIC,
     GET_ALL_COMMENT_TOPIC,
     GET_TWEET_TOPIC,
     NAV_TWEET_TOPIC,
     CHECK_TWEET_GET_COMMENT_TOPIC,
} = PRODUCER_TWEET

const s3Client = new S3Client({
     region,
     endpoint,
     forcePathStyle: false,
     credentials: {
          accessKeyId,
          secretAccessKey,
     },
});
class Middleware {



     public async SIGNUP(req: Request, res: Response, next: NextFunction): Promise<any> {

          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { email, password, name, date_of_birth }: Signup = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ email, password }))
                    await kafkaProducer.sendMessage(PRODUCER_SIGNUP, id, { email, password, name, date_of_birth })
                    next()
                    console.log("Auth Service TOPIC: ", PRODUCER_SIGNUP)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async VERIFY_EMAIL(req: Request, res: Response, next: NextFunction): Promise<any> {

          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { verification } = req.query;
                    await redis.SET_REDIS(id, JSON.stringify({ verification }))
                    await kafkaProducer.sendMessage(VERIFICATION_FROM_API_TO_AUTH, id, { verification })
                    next()
                    console.log("Verify Email TOPIC: ", VERIFICATION_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async VERIFY_OTP(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { otp } = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ otp }))
                    await kafkaProducer.sendMessage(VERIFICATION_OTP_FROM_API_TO_AUTH, id, { otp })
                    next()
                    console.log("Verify OTP TOPIC: ", VERIFICATION_OTP_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async REQUEST_VERIFICATION(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { email } = req.cookies;
                    const mail = decodeURIComponent(email) // giai ma email value ra %40 => @
                    await redis.SET_REDIS(id, JSON.stringify({ mail }))
                    await kafkaProducer.sendMessage(REQUEST_VERIFICATION_FROM_API_TO_AUTH, id, { mail })
                    next()
                    console.log("Request Verification TOPIC: ", REQUEST_VERIFICATION_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async FORGOT_PASSWORD(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { email } = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ email }))
                    await kafkaProducer.sendMessage(FORGOT_PASSWORD_FROM_API_TO_AUTH, id, { email })
                    next()
                    console.log("Request Verification TOPIC: ", FORGOT_PASSWORD_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async RESET_PASSWORD(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { reset } = req.query
                    const { password } = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ password, reset }))
                    await kafkaProducer.sendMessage(RESET_PASSWORD_FROM_API_TO_AUTH, id, { password, reset })
                    next()
                    console.log("Reset Password TOPIC: ", RESET_PASSWORD_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async LOGIN(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {

                    const { email, password } = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ email, password }))
                    await kafkaProducer.sendMessage(LOGIN_FROM_API_TO_AUTH, id, { email, password })
                    next()
                    console.log("LOGIN TOPIC: ", LOGIN_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async CHANGE_PASSWORD(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies;
                    const { oldPassword, newPassword } = req.body;
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, oldPassword, newPassword }))
                    await kafkaProducer.sendMessage(CHANGE_PASSWORD_FROM_API_TO_AUTH, id, { accessToken, oldPassword, newPassword })
                    next()
                    console.log("CHANGE PASSWORD TOPIC: ", CHANGE_PASSWORD_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async UPDATE_PROFILE(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {

                    const { name, date_of_birth, bio, location, website, username } = req.body;
                    const { accessToken } = req.cookies;
                    const updatedFields: Record<string, any> = {};

                    for (const key in req.body) {
                         if (req.body.hasOwnProperty(key)) {
                              updatedFields[key] = req.body[key];
                         }
                    }

                    // Kiểm tra xem có trường nào để cập nhật không
                    if (Object.keys(updatedFields).length === 0) {
                         return response.General_Response(res, 400, "No fields to update");
                    }
                    await redis.SET_REDIS(id, JSON.stringify({ ...updatedFields, accessToken }))
                    await kafkaProducer.sendMessage(UPDATE_PROFILE_FROM_API_TO_AUTH, id, { ...updatedFields, accessToken })
                    next()
                    console.log("UPDATE PROFILE TOPIC: ", UPDATE_PROFILE_FROM_API_TO_AUTH)
                    console.log(
                         accessToken,
                         updatedFields
                    )
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async CHANGE_EMAIL(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {

                    const { email } = req.body;
                    const { accessToken } = req.cookies;

                    await redis.SET_REDIS(id, JSON.stringify({ email, accessToken }))
                    await kafkaProducer.sendMessage(CHANGE_EMAIL_FROM_API_TO_AUTH, id, { email, accessToken })
                    next()
                    console.log("CHANGE EMAIL TOPIC: ", CHANGE_EMAIL_FROM_API_TO_AUTH)

               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async VERIFY_CHANGE_EMAIL(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { confirm } = req.query;
                    await redis.SET_REDIS(id, JSON.stringify({ confirm }))
                    await kafkaProducer.sendMessage(VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH, id, { confirm })
                    next()
                    console.log("VERIFY CHANGE EMAIL TOPIC: ", VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken }))
                    await kafkaProducer.sendMessage(GET_USER_FROM_API_TO_AUTH, id, { accessToken })
                    next()
                    console.log("GET USER TOPIC: ", GET_USER_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async DEL_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const { auth_id } = req.body
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, auth_id }))
                    await kafkaProducer.sendMessage(DEL_USER_FROM_API_TO_AUTH, id, { accessToken, auth_id })
                    next()
                    console.log("DEL USER TOPIC: ", DEL_USER_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async SUSPENDED_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const { auth_id } = req.body
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, auth_id }))
                    await kafkaProducer.sendMessage(SUSPENDED_USER_FROM_API_TO_AUTH, id, { accessToken, auth_id })
                    next()
                    console.log("DEL USER TOPIC: ", SUSPENDED_USER_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async UNSUSPENDED_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const { auth_id } = req.body
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, auth_id }))
                    await kafkaProducer.sendMessage(UNSUSPENDED_USER_FROM_API_TO_AUTH, id, { accessToken, auth_id })
                    next()
                    console.log("DEL USER TOPIC: ", UNSUSPENDED_USER_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async ALL_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken }))
                    await kafkaProducer.sendMessage(ALL_USER_FROM_API_TO_AUTH, id, { accessToken })
                    next()
                    console.log("DEL USER TOPIC: ", ALL_USER_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async LOGOUT(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken }))
                    await kafkaProducer.sendMessage(LOGOUT_FROM_API_TO_AUTH, id, { accessToken })
                    next()
                    console.log("LOGOUT TOPIC: ", LOGOUT_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async SET_AVATAR(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const files = req.files as Express.Multer.File[];
                    let image: number = 0;
                    const storage = getStorage(app);
                    if (!files || files.length === 0) {
                         return response.General_Response(res, 400, "Image is not empty");
                    }
                    for (const file of files) {
                         if (file.mimetype.startsWith("image/")) {
                              if (file.size > 7 * 1024 * 1024) return response.General_Response(res, 400, "IMAGE maximum size is 7MB");
                              image++;
                         }
                         else {
                              return response.General_Response(res, 400, "File invalid: Just allow image file");
                         }
                    }
                    if (image > 1) return response.General_Response(res, 400, "Only allowed to upload 1 photos");


                    await jwt.JWT_VERIFY(accessToken, async (err: any, value: any) => {
                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         await Promise.all(files.map(async (file) => {
                              if (file.mimetype.startsWith("image/")) {
                                   const save = "img/" + performance.now().toString().replace(".", "") + file.mimetype.substring(file.mimetype.lastIndexOf("/")).replace("/", ".");
                                   const metadata = {
                                        contentType: file.mimetype,
                                   };
                                   const imageSharp = await sharp(file.buffer)
                                        .jpeg({ quality: 75 })
                                        .toBuffer();

                                   const storageRef = ref(storage, save);
                                   const uploadTask = uploadBytesResumable(storageRef, imageSharp, metadata);


                                   uploadTask.on('state_changed',
                                        (snapshot) => {
                                             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                             console.log('Upload is ' + progress + '% done');
                                        },
                                        (error: any) => {
                                             console.log(error.message);
                                        },
                                        async () => {
                                             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                             await redis.SET_REDIS(id, JSON.stringify({ value, downloadURL }))
                                             await kafkaProducer.sendMessage(SET_AVATAR_FROM_API_TO_AUTH, id, { ...value, downloadURL })
                                             console.log("SET AVATAR TOPIC: ", SET_AVATAR_FROM_API_TO_AUTH)

                                             next()
                                        }
                                   );

                              }
                              else {
                                   return response.General_Response(res, 400, "File invalid: Just allow image file");
                              }
                         }))
                    })
               }
          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_USERNAME(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { username } = req.query
                    await redis.SET_REDIS(id, JSON.stringify({ username }))
                    await kafkaProducer.sendMessage(USERNAME_FROM_API_TO_AUTH, id, { username })
                    next()
                    console.log("USERNAME TOPIC: ", USERNAME_FROM_API_TO_AUTH)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }



     /////////////////////////// FOLLOW ///////////////////////////

     public async FOLLOW_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const { follow_user } = req.body
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, follow_user }))
                    await kafkaProducer.sendMessage(FOLLOW_TOPIC, id, { accessToken, follow_user })
                    next()
                    console.log("FOLLOW TOPIC: ", FOLLOW_TOPIC)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async UNFOLLOW_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { accessToken } = req.cookies
                    const { unfollow_user } = req.body
                    await redis.SET_REDIS(id, JSON.stringify({ accessToken, unfollow_user }))
                    await kafkaProducer.sendMessage(UNFOLLOW_TOPIC, id, { accessToken, unfollow_user })
                    next()
                    console.log("UNFOLLOW TOPIC: ", UNFOLLOW_TOPIC)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async ALL_FOLLOW_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { user } = req.query
                    await redis.SET_REDIS(id, JSON.stringify({ user }))
                    await kafkaProducer.sendMessage(GET_ALL_FOLLOW_TOPIC, id, { user })
                    next()
                    console.log("ALL FOLLOW TOPIC: ", GET_ALL_FOLLOW_TOPIC)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async ALL_FOLLOWING_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { user } = req.query
                    await redis.SET_REDIS(id, JSON.stringify({ user }))
                    await kafkaProducer.sendMessage(GET_ALL_FOLLOWING_TOPIC, id, { user })
                    next()
                    console.log("ALL FOLLOWING TOPIC: ", GET_ALL_FOLLOWING_TOPIC)
               }

          } catch (error: any) {
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }





     /////////////////////////// TWEET ///////////////////////////
     public async LOGIC_UPLOAD(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const { accessToken } = req.cookies
               const files = req.files as Express.Multer.File[];
               await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
                    if (err) {
                         return response.General_Response(res, 401, err.message);
                    }
                    req.body.auth_id = data.value.auth_id;
                    if (data.value.role !== "user") {
                         return response.General_Response(res, 401, "You are not an user");
                    }
                    if (!files || files.length === 0) {
                         return next();
                    }

                    let URL: any[] = [];
                    let image: number = 0;
                    let video: number = 0;

                    let imageAdded = false;
                    let videoAdded = false;

                    for (const file of files) {
                         if (file.mimetype.startsWith("image/")) {
                              if (file.size > 10 * 1024 * 1024) return response.General_Response(res, 400, "IMAGE maximum size is 10MB");
                              image++;
                              if (imageAdded === false) {
                                   URL.push({ message: "IMAGE" });
                                   imageAdded = true;
                              }
                         }
                         if (file.mimetype.startsWith("video/")) {
                              if (file.size > 100 * 1024 * 1024) return response.General_Response(res, 400, "VIDEO maximum size is 100MB");
                              video++;
                              if (videoAdded === false) {
                                   URL.push({ message: "VIDEO" });
                                   videoAdded = true;
                              }
                         }

                         if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) return response.General_Response(res, 400, "File invalid: Photos or Video");
                    }

                    const storage = getStorage(app);

                    if (image > 4) return response.General_Response(res, 400, "Only allowed to upload 4 photos");
                    if (video > 1) return response.General_Response(res, 400, "Only allowed to upload 1 video");
                    if (image >= 1 && video >= 1) return response.General_Response(res, 400, "Only allowed to upload 4 photos or 1 video");


                    await Promise.all(files.map(async (file) => {

                         if (file.mimetype.startsWith("image/")) {
                              const save = "tweet/img/" + performance.now().toString().replace(".", "") + file.mimetype.substring(file.mimetype.lastIndexOf("/")).replace("/", ".");
                              const metadata = {
                                   contentType: file.mimetype,
                              };
                              const imageSharp = await sharp(file.buffer)
                                   .jpeg({ quality: 75 })
                                   .toBuffer();

                              const storageRef = ref(storage, save);
                              const uploadTask = uploadBytesResumable(storageRef, imageSharp, metadata);

                              return new Promise<void>(async (resolve, reject) => {
                                   uploadTask.on('state_changed',
                                        (snapshot) => {
                                             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                             console.log('Upload is ' + progress + '% done');
                                        },
                                        (error) => {
                                             reject(error);
                                        },
                                        async () => {
                                             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                             URL.push(downloadURL);
                                             resolve();
                                        }
                                   );
                              });
                         }

                         const save = "tweet/video/" + performance.now().toString().replace(".", "") + ".mp4";
                         console.log(save)
                         const metadata = {
                              contentType: "video/mp4",
                         };
                         const storageRef = ref(storage, save);
                         const uploadTask = uploadBytesResumable(
                              storageRef,
                              file.buffer,
                              metadata
                         );

                         return new Promise<void>(async (resolve, reject) => {
                              uploadTask.on('state_changed',
                                   (snapshot) => {
                                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                        console.log('Upload is ' + progress + '% done');
                                   },
                                   (error) => {
                                        reject(error);
                                   },
                                   async () => {
                                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                        URL.push(downloadURL);
                                        resolve();
                                   }
                              );
                         });

                    }))

                    req.body.URL = URL;
                    return next();
               })




          } catch (error: any) {
               console.log(error.message);
               response.Internal_Server_Error(res, error.message, "Internal Server Error");
          }
     }

     public async EDIT_UPLOAD(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = value;
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               const files = req.files as Express.Multer.File[];

               if (!files || files.length === 0) {
                    return next();
               }

               let URL: any[] = [];
               let image: number = 0;
               let video: number = 0;

               let imageAdded = false;
               let videoAdded = false;

               for (const file of files) {
                    if (file.mimetype.startsWith("image/")) {
                         if (file.size > 10 * 1024 * 1024) return response.General_Response(res, 400, "IMAGE maximum size is 10MB");
                         image++;
                         if (imageAdded === false) {
                              URL.push({ message: "IMAGE" });
                              imageAdded = true;
                         }
                    }
                    if (file.mimetype.startsWith("video/")) {
                         if (file.size > 100 * 1024 * 1024) return response.General_Response(res, 400, "VIDEO maximum size is 100MB");
                         video++;
                         if (videoAdded === false) {
                              URL.push({ message: "VIDEO" });
                              videoAdded = true;
                         }
                    }

                    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) return response.General_Response(res, 400, "File invalid: Photos or Video");
               }

               const storage = getStorage(app);

               if (image > 4) return response.General_Response(res, 400, "Only allowed to upload 4 photos");
               if (video > 1) return response.General_Response(res, 400, "Only allowed to upload 1 video");
               if (image >= 1 && video >= 1) return response.General_Response(res, 400, "Only allowed to upload 4 photos or 1 video");


               await Promise.all(files.map(async (file) => {

                    if (file.mimetype.startsWith("image/")) {
                         const save = "tweet/img/" + performance.now().toString().replace(".", "") + file.mimetype.substring(file.mimetype.lastIndexOf("/")).replace("/", ".");
                         const metadata = {
                              contentType: file.mimetype,
                         };
                         const imageSharp = await sharp(file.buffer)
                              .jpeg({ quality: 75 })
                              .toBuffer();

                         const storageRef = ref(storage, save);
                         const uploadTask = uploadBytesResumable(storageRef, imageSharp, metadata);

                         return new Promise<void>(async (resolve, reject) => {
                              uploadTask.on('state_changed',
                                   (snapshot) => {
                                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                        console.log('Upload is ' + progress + '% done');
                                   },
                                   (error) => {
                                        reject(error);
                                   },
                                   async () => {
                                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                        URL.push(downloadURL);
                                        resolve();
                                   }
                              );
                         });
                    }

                    const save = "tweet/video/" + performance.now().toString().replace(".", "") + ".mp4";
                    console.log(save)
                    const metadata = {
                         contentType: "video/mp4",
                    };
                    const storageRef = ref(storage, save);
                    const uploadTask = uploadBytesResumable(
                         storageRef,
                         file.buffer,
                         metadata
                    );

                    return new Promise<void>(async (resolve, reject) => {
                         uploadTask.on('state_changed',
                              (snapshot) => {
                                   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                   console.log('Upload is ' + progress + '% done');
                              },
                              (error) => {
                                   reject(error);
                              },
                              async () => {
                                   const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                   URL.push(downloadURL);
                                   resolve();
                              }
                         );
                    });

               }))

               req.body.URL = URL;
               return next();

          } catch (error: any) {
               console.log(error.message);
               response.Internal_Server_Error(res, error.message, "Internal Server Error");
          }
     }

     public async CREATE_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { URL, auth_id } = req.body
                    const { content } = req.body

                    if (URL === undefined && content === undefined || URL === undefined && content === "" || URL === undefined && content === null) {
                         return response.General_Response(res, 400, "At least one CONTENT or IMAGE or VIDEO is required");
                    }
                    await redis.SET_REDIS(id, JSON.stringify({ content }))
                    await kafkaProducer.sendMessage(CREATE_TWEET_TOPIC, id, { content, URL, auth_id })
                    next()
                    console.log("CREATE_TWEET_TOPIC: ", CREATE_TWEET_TOPIC)


               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async DELETE_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet_id } = req.body
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet_id, auth_id: data.value.auth_id, topic: "RESPONSE_DELETE_TWEET_TOPIC" }))
                         await kafkaProducer.sendMessage(DELETE_TWEET_TOPIC_SERVICES, id, { tweet_id, auth_id: data.value.auth_id, topic: "RESPONSE_DELETE_TWEET_TOPIC" })
                         next()
                         console.log("DELETE_TWEET_TOPIC_SERVICES: ", DELETE_TWEET_TOPIC_SERVICES)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async ROLE_USER(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet }))
                         await kafkaProducer.sendMessage(CHECK_TWEET, id, { tweet, auth_id: data.value.auth_id })
                         req.body.tweet_id = tweet
                         req.body.auth_id = data.value.auth_id
                         next()
                         console.log("CHECK_TWEET: ", CHECK_TWEET)
                    })

               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async EDIT_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet_id, auth_id, content, URL } = req.body
                    // take content and file if have or next
                    if (URL === undefined && content === undefined || URL === undefined && content === null) {
                         return response.General_Response(res, 400, "You do not EDIT anything");
                    }

                    await redis.SET_REDIS(id, JSON.stringify({ tweet_id, auth_id, content, URL }))
                    await kafkaProducer.sendMessage(EDIT_TWEET_TOPIC, id, { tweet_id, auth_id, content, URL })
                    next()
                    console.log("EDIT_TWEET_TOPIC: ", EDIT_TWEET_TOPIC)
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async RETWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    const { content } = req.body
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet, content, auth_id: data.value.auth_id, topic: "RESPONSE_RETWEET_TOPIC" }))
                         await kafkaProducer.sendMessage(RETWEET_TOPIC, id, { tweet_id: tweet, content, auth_id: data.value.auth_id, topic: "RESPONSE_RETWEET_TOPIC" })
                         next()
                         console.log("RETWEET_TOPIC: ", RETWEET_TOPIC)
                    })

               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async UN_RETWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet, auth_id: data.value.auth_id, topic: "REPONSE_UNRETWEET_TOPIC" }))
                         await kafkaProducer.sendMessage(UNRETWEET_TOPIC, id, { tweet_id: tweet, auth_id: data.value.auth_id, topic: "REPONSE_UNRETWEET_TOPIC" })
                         next()
                         console.log("UNRETWEET_TOPIC: ", UNRETWEET_TOPIC)
                    })

               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async LIKE_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet_id: tweet, auth_id: data.value.auth_id, }))
                         await kafkaProducer.sendMessage(CHECK_TWEET_TOPIC, id, { tweet_id: tweet, auth_id: data.value.auth_id, topic: "REPONSE_LIKE_TOPIC" })
                         next()
                         console.log("CHECK_TWEET_TOPIC: ", CHECK_TWEET_TOPIC)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async unLike_Tweet(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet_id: tweet, auth_id: data.value.auth_id, }))
                         await kafkaProducer.sendMessage(unLIKE_TWEET_TOPIC, id, { tweet_id: tweet, auth_id: data.value.auth_id, topic: "REPONSE_UNLIKE_TOPIC" })
                         next()
                         console.log("CHECK_TWEET_TOPIC: ", unLIKE_TWEET_TOPIC)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async COMMENT_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query
                    const { accessToken } = req.cookies
                    const { content } = req.body
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ tweet_id: tweet, auth_id: data.value.auth_id, content }))
                         await kafkaProducer.sendMessage(CHECK_TWEET_FOR_COMMENT_TOPIC, id, { tweet_id: tweet, auth_id: data.value.auth_id, topic: "REPONSE_COMMENT_TOPIC", content })
                         next()
                         console.log("CHECK_TWEET_FOR_COMMENT_TOPIC: ", CHECK_TWEET_FOR_COMMENT_TOPIC)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_COMMENT(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { comment } = req.query

                    await redis.SET_REDIS(id, JSON.stringify({ comment }))
                    await kafkaProducer.sendMessage(GET_COMMENT_TOPIC, id, { comment, topic: "RESPONSE_GET_COMMENT_TOPIC" })
                    next()
                    console.log("GET COMMENT: ", GET_COMMENT_TOPIC)

               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async DEL_COMMENT(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { comment } = req.query
                    const { accessToken } = req.cookies
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ comment, auth_id: data.value.auth_id }))
                         await kafkaProducer.sendMessage(DEL_COMMENT_TOPIC, id, { comment, auth_id: data.value.auth_id, topic: "RESPONSE_DEL_COMMENT_TOPIC" })
                         next()
                         console.log("DEL_COMMENT_TOPIC: ", DEL_COMMENT_TOPIC)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async EDIT_COMMENT(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { comment } = req.query
                    const { accessToken } = req.cookies
                    const { content } = req.body
                    await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {

                         if (err) {
                              return response.General_Response(res, 401, err.message);
                         }
                         if (data.value.role !== "user") {
                              return response.General_Response(res, 401, "You are not an user");
                         }
                         await redis.SET_REDIS(id, JSON.stringify({ comment, auth_id: data.value.auth_id, content, }))
                         await kafkaProducer.sendMessage(EDIT_COMMENT_TOPIC, id, { comment, auth_id: data.value.auth_id, content, topic: "RESPONSE_EDIT_COMMENT_TOPIC" })
                         next()
                         console.log("EDIT_COMMENT_TOPIC: ", EDIT_COMMENT_TOPIC)
                    })
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_ALL_COMMENT(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query

                    await redis.SET_REDIS(id, JSON.stringify({ tweet }))
                    await kafkaProducer.sendMessage(CHECK_TWEET_GET_COMMENT_TOPIC, id, { tweet, topic: "RESPONSE_ALL_COMMENT_TWEET_TOPIC" })
                    next()
                    console.log("CHECK_TWEET_GET_COMMENT_TOPIC: ", CHECK_TWEET_GET_COMMENT_TOPIC)
                    // GET_ALL_COMMENT_TOPIC
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_TWEET_BY_ID(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { tweet } = req.query

                    await redis.SET_REDIS(id, JSON.stringify({ tweet }))
                    await kafkaProducer.sendMessage(GET_TWEET_TOPIC, id, { tweet_id: tweet, topic: "RESPONSE_GET_TWEET_ID" })
                    next()
                    console.log("RESPONSE_GET_TWEET_ID: ", GET_TWEET_TOPIC)
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async NAV_TWEET(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    const { page } = req.query

                    await redis.SET_REDIS(id, JSON.stringify({ page }))
                    await kafkaProducer.sendMessage(NAV_TWEET_TOPIC, id, { page, topic: "RESPONSE_NAV_PAGE" })
                    next()
                    console.log("NAV_TWEET_TOPIC: ", NAV_TWEET_TOPIC)
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async Search_by_Content(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    next()
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async elasticSearch(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    next()
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }

     public async GET_USER_BY_ID(req: Request, res: Response, next: NextFunction): Promise<any> {
          try {
               const schemaErrors = validationResult(req);
               if (!schemaErrors.isEmpty()) {
                    const errorMessages = schemaErrors.array().map(error => error.msg);
                    return response.General_Response(res, 400, errorMessages);
               }
               else {
                    next()
               }

          } catch (error: any) {
               console.log(error.message)
               response.Internal_Server_Error(res, error.message, "Internal Server Error")
          }
     }
}

export {
     Middleware
}