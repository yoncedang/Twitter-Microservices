
import { PRODUCER } from "../Kafka/TOPIC";
import { PrismaClient } from '@prisma/client'
import { Signup } from "../Interface/Interface";
import bcrypt from "bcrypt";
import { Jsonwebtoken } from "../Config/Jsonwebtoken";
import { RedisClass } from "../Redis/Redis";
import { v4 as uuidv4 } from "uuid";
import { KafkaProducer } from "../Kafka/Producer";
import randomatic from "randomatic";
import { DEL_user } from "../Interface/Interface";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { DigitalOcean } from "../Config/Config";
import { ElasticsearchService } from "../ElasticSearch/Elasticsearch";
import { app } from "../Config/Firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";

const s3Client = new S3Client({
     region: "sgp1",
     endpoint: "https://sgp1.digitaloceanspaces.com",
     forcePathStyle: false,
     credentials: {
          accessKeyId: DigitalOcean.accessKeyId,
          secretAccessKey: DigitalOcean.secretAccessKey,
     },
});
const storage = getStorage(app);
const elastic = new ElasticsearchService();
const producer = new KafkaProducer();
const redis = new RedisClass();
const jwt = new Jsonwebtoken();
const uuid = uuidv4();
const prisma = new PrismaClient();
const {
     RESPONSE_FROM_AUTH_SERVICE,
     PRODUCER_SIGNUP_NODEMAILER,
     RESPONSE_VERIFICATION_EMAIL_FROM_AUTH,
     RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH,
     RESPONSE_REQUEST_VERIFICATION,
     PRODUCER_SIGNUP_NODEMAILER_REQUEST_VERIFICATION,
     RESPONSE_FORGOT_PASSWORD,
     FORGOT_PASSWORD_NODEMAILER,
     RESPONSE_RESET_PASSWORD,
     RESPONSE_LOGIN,
     RESPONSE_REQUEST_ACCESSTOKEN,
     RESPONSE_CHANGE_PASSWORD,
     RESPONSE_UPDATE_PROFILE,
     RESPONSE_CHANGE_EMAIL,
     CHANGE_EMAIL_NODEMAILER,
     RESPONSE_VERIFY_CHANGE_EMAIL,
     RESPONSE_GET_USER,
     RESPONSE_DEL_USER,
     RESPONSE_SUSPENDED_USER,
     RESPONSE_SUSPENDED_USER_NODEMAILER,
     RESPONSE_UNSUSPENDED_USER_NODEMAILER,
     RESPONSE_UNSUSPENDED_USER,
     RESPONSE_ALL_USER,
     RESPONSE_LOGOUT,
     RESPONSE_SET_AVATAR,
     RESPONSE_USERNAME,
     RESPONSE_FOLLOW_TOPIC,
     FOLLOW_USER_SERVICES,
     RESPONSE_UNFOLLOW_TOPIC,
     UNFOLLOW_USER_SERVICES,
     RESPONSE_ALL_FOLLOW_TOPIC,
     ALL_FOLLOW_USER_SERVICES,
     RESPONSE_ALL_FOLLOWING_TOPIC,
     ALL_FOLLOWING_USER_SERVICES,
     RESPONSE_TWEET_TOPIC,
     TWEET_TOPIC_SERVICES,
     RESPONSE_DELETE_TWEET_TOPIC,
     DELETE_TWEET_TOPIC_SERVICES,
     CREATE_FOLLOW_TOPIC,

} = PRODUCER;



class Auth_Controller {


     private async Response(topic: string, message: string, status: number) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status })
     }

     private async Response_With_Data(topic: string, status: number, message: any, data: any) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status, ...data })
     }

     private randomOTP(): string {
          return randomatic('0', 6);
     }

     private randomUsername(): string {
          const minLength = 6;
          const maxLength = 26;
          const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
          return randomatic('Aa0', length);
     }

     private async Index_Elastic(data: any) {
          const indexExists = await elastic.esClient.indices.exists({
               index: "user",
          });
          if (!indexExists) {
               await elastic.esClient.indices.create({
                    index: "user",
               });
               await elastic.esClient.index({
                    index: "user",
                    id: data?.auth_id.toString(), // Sử dụng tweet_id làm ID
                    body: {
                         data,
                    },
               });
          }
          await elastic.esClient.index({
               index: "user",
               id: data?.auth_id.toString(), // Sử dụng tweet_id làm ID
               body: {
                    data,
               },
          });

     } /// Create tweet in ElasticSearch

     public async SIGNUP(data: any): Promise<any> {
          // console.log("data: ", data);


          const { email, password, name, date_of_birth }: Signup = data;
          const checkEmail = await prisma.auth.findFirst({ where: { email } })

          if (checkEmail) {
               return this.Response(RESPONSE_FROM_AUTH_SERVICE, "Email already exists", 422)
          }

          const create = await prisma.auth.create({
               data: {
                    name,
                    date_of_birth: new Date(date_of_birth),
                    email,
                    password: bcrypt.hashSync(password, 10)
               }
          })
          await this.Response_With_Data(CREATE_FOLLOW_TOPIC, 200, "Follow", { auth_id: create.auth_id })

          if (create) {
               await prisma.profile.create({
                    data: {
                         username: this.randomUsername(),
                         auth_id: create.auth_id,
                         avatar: "https://twitter.sgp1.digitaloceanspaces.com/img.jpeg"
                    }
               })
               const verification = await jwt.JWT_VERIFY_ACCOUNT({ auth_id: create.auth_id }) // token send to nodemailer
               await redis.SET_REDIS((uuid + "-SIGNUP"), email) // Set token verify on Redis
               await producer.sendMessage(PRODUCER_SIGNUP_NODEMAILER, (uuid + "-SIGNUP"), { otp: this.randomOTP(), email, verification })

               return this.Response(RESPONSE_FROM_AUTH_SERVICE, `Please check your email: ${create.email}`, 200)
          }

     }

     public async VERIFICATION_EMAIL(data: any): Promise<any> {
          // console.log("token day ne: ", data);
          const { verification } = data;
          await jwt.JWT_VERIFY_EMAIL(verification, async (err: any, value: any) => {
               if (err) {
                    return this.Response(RESPONSE_VERIFICATION_EMAIL_FROM_AUTH, err.message, 401)
               }
               const { auth_id } = value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_VERIFICATION_EMAIL_FROM_AUTH, "Account not found", 404)
               }
               if (currentAccount?.activity === "online") {
                    return this.Response(RESPONSE_VERIFICATION_EMAIL_FROM_AUTH, "Account already verified", 422)
               }
               const update = await prisma.auth.update({
                    where: { auth_id },
                    data: {
                         activity: "online",
                         isUpdated: true
                    }
               })
               if (update) {
                    const getUser = await prisma.auth.findFirst({
                         where: { auth_id }, // Thay auth_id bằng giá trị bạn cần tìm
                         select: {
                              auth_id: true,
                              email: true,
                              name: true,
                              date_of_birth: true,
                              role: true,
                              activity: true,
                              isUpdated: true,
                              createdAt: true,
                              updatedAt: true,
                              Profile: {
                                   select: {
                                        bio: true,
                                        location: true,
                                        website: true,
                                        username: true,
                                        avatar: true,
                                   },
                              }
                         }
                    })
                    console.log("Update success");
                    this.Index_Elastic(getUser)

                    return this.Response(RESPONSE_VERIFICATION_EMAIL_FROM_AUTH, "Verification success", 200)
               }

          })
     }

     public async VERIFICATION_OTP(data: any): Promise<any> {
          const { otp } = data;
          const checkOTP = await redis.GET_REDIS(otp)
          if (!checkOTP) {
               return this.Response(RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH, "OTP not found", 404)
          }
          const currentAccount = await prisma.auth.findFirst({ where: { email: checkOTP } })
          if (!currentAccount) {
               return this.Response(RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH, "Account not found", 404)
          }
          if (currentAccount?.activity === "online") {
               return this.Response(RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH, "Account already verified", 422)
          }
          const update = await prisma.auth.update({
               where: { auth_id: currentAccount.auth_id },
               data: {
                    activity: "online",
                    isUpdated: true
               }
          })
          if (update) {
               await redis.DEL_REDIS(otp)
               const getUser = await prisma.auth.findFirst({
                    where: { auth_id: update.auth_id }, // Thay auth_id bằng giá trị bạn cần tìm
                    select: {
                         auth_id: true,
                         email: true,
                         name: true,
                         date_of_birth: true,
                         role: true,
                         activity: true,
                         isUpdated: true,
                         createdAt: true,
                         updatedAt: true,
                         Profile: {
                              select: {
                                   bio: true,
                                   location: true,
                                   website: true,
                                   username: true,
                                   avatar: true,
                              },
                         }
                    }
               })
               console.log("Update success");
               this.Index_Elastic(getUser)
               return this.Response(RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH, "Verification success", 200)
          }

     }

     public async REQUEST_VERIFICATION(data: any): Promise<any> {
          const { mail } = data
          const checkEmail = await prisma.auth.findFirst({ where: { email: mail } })
          if (!checkEmail) {
               return this.Response(RESPONSE_REQUEST_VERIFICATION, "Email not found", 404)
          }
          if (checkEmail?.activity === "online") {
               return this.Response(RESPONSE_REQUEST_VERIFICATION, "Account already verified", 422)
          }
          const verification = await jwt.JWT_VERIFY_ACCOUNT({ auth_id: checkEmail.auth_id }) // token send to nodemailer
          await redis.SET_REDIS((uuid + "-REQUEST_VERIFICATION"), mail) // Set token verify on Redis
          await producer.sendMessage(PRODUCER_SIGNUP_NODEMAILER_REQUEST_VERIFICATION, (uuid + "-REQUEST_VERIFICATION"), { otp: this.randomOTP(), email: mail, verification })

          return this.Response(RESPONSE_REQUEST_VERIFICATION, `Please check your email: ${checkEmail.email}`, 200)
     }

     public async FORGOT_PASSWORD(data: any): Promise<any> {
          const { email } = data;
          const checkEmail = await prisma.auth.findFirst({ where: { email } })
          if (!checkEmail) {
               return this.Response(RESPONSE_FORGOT_PASSWORD, "Email not found", 404)
          }
          const verification = await jwt.JWT_VERIFY_ACCOUNT({ auth_id: checkEmail.auth_id }) // token send to nodemailer
          await redis.SET_REDIS((uuid + "-FORGOT_PASSWORD"), email) // Set token verify on Redis
          await producer.sendMessage(FORGOT_PASSWORD_NODEMAILER, (uuid + "-FORGOT_PASSWORD"), { email: checkEmail.email, verification })

          return this.Response(RESPONSE_FORGOT_PASSWORD, `Please check your email: ${checkEmail.email}`, 200)
     }

     public async RESET_PASSWORD(data: any): Promise<any> {

          const { reset, password } = data;
          await jwt.JWT_VERIFY_EMAIL(reset, async (err: any, value: any) => {
               if (err) {
                    return this.Response(RESPONSE_RESET_PASSWORD, err.message, 401)
               }

               const { auth_id } = value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_RESET_PASSWORD, "Account not found", 404)
               }
               const update = await prisma.auth.update({
                    where: { auth_id },
                    data: {
                         password: bcrypt.hashSync(password, 10),
                    }
               })
               if (update) {
                    return this.Response(RESPONSE_RESET_PASSWORD, "Update password success", 200)
               }
          })
     }

     public async LOGIN(data: any): Promise<any> {
          const { email, password } = data;

          const checkEmail = await prisma.auth.findFirst({ where: { email } })
          if (!checkEmail) {
               return this.Response(RESPONSE_LOGIN, "Email not found", 404)
          }
          const comparePassword = bcrypt.compareSync(password, checkEmail.password)
          if (!comparePassword) {
               return this.Response(RESPONSE_LOGIN, "Password not match", 422)
          }
          if (checkEmail?.activity === "offline" && checkEmail?.isUpdated === false) {
               return this.Response(RESPONSE_LOGIN, "Account NOT verified", 422)
          }

          if (checkEmail?.activity === "offline") {
               return this.Response(RESPONSE_LOGIN, "Account is suspended", 422)
          }
          const value = {
               auth_id: checkEmail.auth_id,
               email: checkEmail.email,
               name: checkEmail.name,
               role: checkEmail.role,
               date_of_birth: checkEmail.date_of_birth,
               activity: checkEmail.activity,
               isUpdated: checkEmail.isUpdated,

          }
          const accessToken = await jwt.ACCESS_TOKEN({ value })
          const refreshToken = await jwt.REFRESH_TOKEN({ value })

          await redis.SET_REFRESH(value.auth_id, refreshToken) // Set token verify on Redis
          return this.Response_With_Data(RESPONSE_LOGIN, 200, "Login success", { accessToken, auth_id: value.auth_id })

     }

     public async CHANGE_PASSWORD(data: any): Promise<any> {
          const { accessToken, oldPassword, newPassword } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_CHANGE_PASSWORD, err.message, 401)
               }
               const { auth_id } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_CHANGE_PASSWORD, "Account not found", 404)
               }
               const comparePassword = bcrypt.compareSync(oldPassword, currentAccount.password)
               if (!comparePassword) {
                    return this.Response(RESPONSE_CHANGE_PASSWORD, "Password not match", 422)
               }
               if (newPassword === oldPassword) {
                    return this.Response(RESPONSE_CHANGE_PASSWORD, "New password must be different from old password", 422)
               }
               const update = await prisma.auth.update({
                    where: { auth_id },
                    data: {
                         password: bcrypt.hashSync(newPassword, 10),
                    }
               })
               if (update) {
                    return this.Response(RESPONSE_CHANGE_PASSWORD, "Update password success", 200)
               }
          })
     }

     public async UPDATE_PROFILE(data: any): Promise<any> {

          const { accessToken, name, date_of_birth, bio, location, website, username } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_UPDATE_PROFILE, err.message, 401)
               }
               const { auth_id } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_UPDATE_PROFILE, "Account not found", 404)
               }

               await prisma.auth.update({
                    where: { auth_id: currentAccount.auth_id },
                    data: {
                         name,
                         date_of_birth: date_of_birth ? new Date(date_of_birth) : currentAccount.date_of_birth,
                    }
               })
               const checkProfile = await prisma.profile.findFirst({ where: { auth_id } })
               if (!checkProfile) {
                    return this.Response(RESPONSE_UPDATE_PROFILE, "Profile not found", 404)
               }
               await prisma.profile.update({
                    where: { profile_id: checkProfile.profile_id },
                    data: {
                         bio,
                         location,
                         website,
                         username
                    }
               })

               const getUser = await prisma.auth.findFirst({
                    where: { auth_id }, // Thay auth_id bằng giá trị bạn cần tìm
                    select: {
                         auth_id: true,
                         email: true,
                         name: true,
                         date_of_birth: true,
                         role: true,
                         activity: true,
                         isUpdated: true,
                         createdAt: true,
                         updatedAt: true,
                         Profile: {
                              select: {
                                   bio: true,
                                   location: true,
                                   website: true,
                                   username: true,
                                   avatar: true,
                              },
                         },
                    }
               })

               await elastic.esClient.update({
                    index: "user",
                    id: auth_id.toString(),
                    body: {
                         doc: {
                              "data": getUser
                         }
                    }
               })
               return this.Response(RESPONSE_UPDATE_PROFILE, "Update profile success", 200)





          })
     }

     public async CHANGE_EMAIL(data: any): Promise<any> {
          console.log("data: ", data);
          const { accessToken, email } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    console.log("err: ", err.message);
                    return this.Response(RESPONSE_CHANGE_EMAIL, err.message, 401)
               }
               else {
                    const { auth_id } = data.value;
                    const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
                    const checkEmail = await prisma.auth.findMany()

                    if (checkEmail.find((item) => item.email === email)) {
                         return this.Response(RESPONSE_CHANGE_EMAIL, "Email already exists", 422)
                    }
                    if (!currentAccount) {
                         return this.Response(RESPONSE_CHANGE_EMAIL, "Account not found", 404)
                    }
                    if (email === currentAccount.email) {
                         return this.Response(RESPONSE_CHANGE_EMAIL, "New email must be different from old email", 422)
                    }
                    const verification = await jwt.JWT_VERIFY_ACCOUNT({ auth_id: currentAccount.auth_id, email }) // token send to nodemailer
                    await redis.SET_REDIS(`Check Email: ${auth_id}`, currentAccount.email) // Set token verify on Redis
                    await this.Response_With_Data(CHANGE_EMAIL_NODEMAILER, 200, "to NODEMAILER Service", { email: email, verification })

                    return this.Response(RESPONSE_CHANGE_EMAIL, `Please check your email: ${email} to confirm`, 200)
               }

          })
     }

     public async VERIFY_CHANGE_EMAIL(data: any): Promise<any> {
          // console.log("data: ", data);
          const { confirm } = data;
          await jwt.JWT_VERIFY_EMAIL(confirm, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_VERIFY_CHANGE_EMAIL, err.message, 401)
               }
               else {
                    const { auth_id, email } = data;
                    const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
                    const checkRedis = await redis.GET_REDIS(`Check Email: ${auth_id}`)
                    if (!checkRedis) {
                         return this.Response(RESPONSE_VERIFY_CHANGE_EMAIL, "Email already verification", 404)
                    }
                    if (!currentAccount) {
                         return this.Response(RESPONSE_VERIFY_CHANGE_EMAIL, "Account not found", 404)
                    }
                    const update = await prisma.auth.update({
                         where: { auth_id },
                         data: {
                              email,
                         }
                    })
                    if (update) {
                         await redis.DEL_REDIS(`Check Email: ${auth_id}`)
                         await elastic.esClient.update({
                              index: "user",
                              id: auth_id.toString(),
                              body: {
                                   doc: {
                                        "data": {
                                             "email": email
                                        }
                                   }
                              }
                         })
                         return this.Response(RESPONSE_VERIFY_CHANGE_EMAIL, "Update success", 200)
                    }
               }
          })
     }

     public async GET_USER(data: any): Promise<any> {
          const { accessToken } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_GET_USER, err.message, 401)
               }
               const { auth_id } = data.value;

               const results = await elastic.esClient.get({
                    index: "user",
                    id: auth_id.toString(),
               })
               const resutlsAccount = results.body._source.data
               if (resutlsAccount.length === 0 || !resutlsAccount) {
                    return this.Response(RESPONSE_GET_USER, "Account not found", 404)
               }
               console.log("resutlsAccount: ", resutlsAccount);

               return this.Response_With_Data(RESPONSE_GET_USER, 200, "Get information success", { data: resutlsAccount })
          })
     }

     public async ALL_USER(data: any): Promise<any> {
          const { accessToken } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_ALL_USER, err.message, 401)
               }
               const { role } = data.value;
               if (role !== "admin") {
                    return this.Response(RESPONSE_ALL_USER, "You are not admin", 401)
               }
               const users = await elastic.esClient.search({
                    index: "user",
                    body: {
                         query: {
                              match_all: {}
                         }
                    }
               });
               if (users.body.hits.hits.length === 0) {
                    return this.Response(RESPONSE_ALL_USER, "No users found", 404);
               }

               const getAllUser = users.body.hits.hits.map((hit: any) => hit._source.data);
               return this.Response_With_Data(RESPONSE_ALL_USER, 200, "Get all user success", { data: getAllUser })
          })
     }

     public async DEL_USER(data: any): Promise<any> {
          const { accessToken, auth_id } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_DEL_USER, err.message, 401)
               }

               console.log(typeof auth_id);
               const { role } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id: data.value.auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_DEL_USER, "Account not found", 404)
               }
               if (role !== "admin") {
                    return this.Response(RESPONSE_DEL_USER, "You are not admin", 401)
               }
               const checkAccount = await prisma.auth.findFirst({ where: { auth_id: Number(auth_id) } })
               if (!checkAccount) {
                    return this.Response(RESPONSE_DEL_USER, "user not found", 404)
               }

               if (currentAccount.auth_id === checkAccount.auth_id) {
                    return this.Response(RESPONSE_DEL_USER, "You can't delete yourself", 401)
               }

               await prisma.profile.deleteMany({
                    where: { auth_id: checkAccount.auth_id },
               });
               await prisma.auth.delete({
                    where: { auth_id: checkAccount.auth_id },
               })
               await redis.DEL_REDIS(auth_id)
               await redis.SET_REDIS(uuid + "-DEL_ACCOUNT", auth_id) // Set token verify on Redis
               await producer.sendMessage("DEL_INTERACT", uuid + "-DEL_ACCOUNT", auth_id)
               await elastic.esClient.delete({
                    index: "user",
                    id: auth_id.toString(),
               })
               return this.Response(RESPONSE_DEL_USER, `Delete success user: ${checkAccount.email}`, 200)
          })
     }

     public async SUSPEND_USER(data: any): Promise<any> {
          const { accessToken, auth_id } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_SUSPENDED_USER, err.message, 401)
               }
               const { role } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id: data.value.auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_SUSPENDED_USER, "Account not found", 404)
               }
               if (role !== "admin") {
                    return this.Response(RESPONSE_SUSPENDED_USER, "You are not admin", 401)
               }
               const checkAccount = await prisma.auth.findFirst({ where: { auth_id: Number(auth_id) } })
               if (!checkAccount) {
                    return this.Response(RESPONSE_SUSPENDED_USER, "user not found", 404)
               }

               if (currentAccount.auth_id === checkAccount.auth_id) {
                    return this.Response(RESPONSE_SUSPENDED_USER, "You can't suspend yourself", 401)
               }

               if (checkAccount.activity === "offline") {
                    return this.Response(RESPONSE_SUSPENDED_USER, "Account already suspended", 422)
               }

               await prisma.auth.update({
                    where: { auth_id: checkAccount.auth_id },
                    data: {
                         activity: "offline",
                    }
               })

               await elastic.esClient.update({
                    index: "user",
                    id: auth_id.toString(),
                    body: {
                         doc: {
                              "data": {
                                   "activity": "offline"
                              }
                         }
                    }
               })

               const checkREDIS = await redis.GET_REDIS(auth_id)
               if (!checkREDIS || checkREDIS) {
                    await redis.DEL_REDIS(auth_id)
                    await redis.SET_REDIS((uuid + "-SUSPENDED_ACCOUNT"), auth_id) // Set token verify on Redis
                    await producer.sendMessage(RESPONSE_SUSPENDED_USER_NODEMAILER, (uuid + "-SUSPENDED_ACCOUNT"), { email: checkAccount.email })
                    return this.Response(RESPONSE_SUSPENDED_USER, `Suspended success: ${checkAccount.email}`, 200)
               }
               // await redis.SET_REDIS((uuid + "-SUSPENDED_ACCOUNT"), auth_id) // Set token verify on Redis
               // await producer.sendMessage(RESPONSE_SUSPENDED_USER_NODEMAILER, (uuid + "-SUSPENDED_ACCOUNT"), { email: checkAccount.email })
               // return this.Response(RESPONSE_SUSPENDED_USER, `Suspended success: ${checkAccount.email}`, 200)
          })
     }

     public async UNSUSPEND_USER(data: any): Promise<any> {
          const { accessToken, auth_id } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, err.message, 401)
               }
               const { role } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id: data.value.auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, "Account not found", 404)
               }
               if (role !== "admin") {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, "You are not admin", 401)
               }
               const checkAccount = await prisma.auth.findFirst({ where: { auth_id: Number(auth_id) } })
               if (!checkAccount) {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, "user not found", 404)
               }

               if (currentAccount.auth_id === checkAccount.auth_id) {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, "You can't suspend yourself", 401)
               }

               if (checkAccount.activity === "online") {
                    return this.Response(RESPONSE_UNSUSPENDED_USER, "Account already unsuspended", 422)
               }

               const update = await prisma.auth.update({
                    where: { auth_id: checkAccount.auth_id },
                    data: {
                         activity: "online",
                    }
               })
               if (update) {
                    await redis.SET_REDIS((uuid + "-UNSUSPENDED_ACCOUNT"), auth_id) // Set token verify on Redis
                    await producer.sendMessage(RESPONSE_UNSUSPENDED_USER_NODEMAILER, (uuid + "-UNSUSPENDED_ACCOUNT"), { email: update.email })
                    await elastic.esClient.update({
                         index: "user",
                         id: auth_id.toString(),
                         body: {
                              doc: {
                                   "data": {
                                        "activity": "online"
                                   }
                              }
                         }
                    })
                    return this.Response(RESPONSE_UNSUSPENDED_USER, `Unsuspended success: ${update.email}`, 200)
               }

          })
     }

     public async LOGOUT(data: any): Promise<any> {
          const { accessToken } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_LOGOUT, err.message, 401)
               }
               const { auth_id } = data.value;
               const currentAccount = await prisma.auth.findFirst({ where: { auth_id } })
               if (!currentAccount) {
                    return this.Response(RESPONSE_LOGOUT, "Account not found", 404)
               }
               const RefreshtokenDel = await redis.DEL_REDIS(auth_id)
               if (!RefreshtokenDel) {
                    return this.Response(RESPONSE_LOGOUT, "Refresh token not found", 404)
               }
               return this.Response(RESPONSE_LOGOUT, "Logout success", 200)
          })
     }

     public async SET_AVATAR(data: any): Promise<any> {
          console.log("data: ", data);
          const { downloadURL } = data;
          const { auth_id } = data.value;

          const checkProfile = await prisma.profile.findFirst({ where: { auth_id } })
          if (!checkProfile) {
               // Nếu mà tìm không ra USER, thì ảnh vừa tạo sẽ được xóa đi ...
               const getPath = downloadURL.substring(downloadURL.lastIndexOf("/") + 1).split("?")[0];
               const realPath = decodeURIComponent(getPath)

               const fileRef = ref(storage, realPath);
               try {
                    await deleteObject(fileRef);
                    console.log(`File ${realPath} deleted successfully.`);
               } catch (error: any) {
                    console.error(`Error deleting file ${realPath}: ${error.message}`);
               }
               return this.Response(RESPONSE_SET_AVATAR, "Account not found", 404)
          }
          if (checkProfile.avatar) {
               const getPath = checkProfile.avatar.substring(checkProfile.avatar.lastIndexOf("/") + 1).split("?")[0];
               const realPath = decodeURIComponent(getPath)
               console.log("realPath: ", realPath);
               const fileRef = ref(storage, realPath);
               try {
                    await deleteObject(fileRef);
                    console.log(`File ${realPath} deleted successfully.`);
               } catch (error: any) {
                    console.error(`Error deleting file ${realPath}: ${error.message}`);
               }
          } // Check avatar exists to delete old avatar -- Avatar mặc định sẽ không bị xóa trên cloud
          const update = await prisma.profile.update({
               where: { profile_id: checkProfile.profile_id },
               data: {
                    avatar: downloadURL,
               }
          })
          if (update) {
               await elastic.esClient.update({
                    index: "user",
                    id: auth_id.toString(),
                    body: {
                         doc: {
                              "data": {
                                   "Profile": {
                                        "bio": update.bio,
                                        "location": update.location,
                                        "website": update.website,
                                        "username": update.username,
                                        "avatar": update.avatar,
                                   }
                              }
                         }
                    }
               })
               return this.Response(RESPONSE_SET_AVATAR, "Set avatar success", 200)
          }
     }

     public async GET_USERNAME(data: any): Promise<any> {
          console.log("data: ", data);
          const { username } = data;
          const users = await elastic.esClient.search({
               index: "user",
               body: {
                    query: {
                         match: {
                              "data.Profile.username": username
                         }
                    }
               }
          })
          if (users.body.hits.hits.length > 0) {
               const user = users.body.hits.hits[0]._source.data;
               return this.Response_With_Data(RESPONSE_USERNAME, 200, "Get information success", { user });
          } else {
               return this.Response(RESPONSE_USERNAME, "Username not found", 404);
          }
     }




     ///////////////////////////// FOLLOW USER /////////////////////////////


     public async FOLLOW_USER(data: any): Promise<any> {
          console.log("data: ", data);
          const { accessToken, follow_user } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_FOLLOW_TOPIC, err.message, 401)
               }
               const { auth_id } = data.value;
               if (auth_id === Number(follow_user)) {
                    return this.Response(RESPONSE_FOLLOW_TOPIC, "You can't follow yourself", 401)
               }
               const checkAuth = await prisma.auth.findFirst({ where: { auth_id } })
               if (!checkAuth) {
                    return this.Response(RESPONSE_FOLLOW_TOPIC, "Account not found", 404)
               }

               const checkFollowUser = await prisma.auth.findFirst({ where: { auth_id: Number(follow_user) } })
               if (!checkFollowUser) {
                    return this.Response(RESPONSE_FOLLOW_TOPIC, "Follow user not found", 404)
               }
               if (checkFollowUser.activity === "offline") {
                    return this.Response(RESPONSE_FOLLOW_TOPIC, "Follow user is suspended", 422)
               }
               return this.Response_With_Data(FOLLOW_USER_SERVICES, 200, "RESPONSE_FOLLOW_TOPIC", { auth_id: checkAuth.auth_id, follow_user: checkFollowUser.auth_id })

          })
     }

     public async UNFOLLOW_USER(data: any): Promise<any> {
          console.log("data: ", data);
          const { accessToken, unfollow_user } = data;
          await jwt.JWT_VERIFY(accessToken, async (err: any, data: any) => {
               if (err) {
                    return this.Response(RESPONSE_UNFOLLOW_TOPIC, err.message, 401)
               }
               const { auth_id } = data.value;
               if (auth_id === Number(unfollow_user)) {
                    return this.Response(RESPONSE_UNFOLLOW_TOPIC, "You can't unfollow yourself", 401)
               }
               const checkAuth = await prisma.auth.findFirst({ where: { auth_id } })
               if (!checkAuth) {
                    return this.Response(RESPONSE_UNFOLLOW_TOPIC, "Account not found", 404)
               }

               const checkFollowUser = await prisma.auth.findFirst({ where: { auth_id: Number(unfollow_user) } })
               if (!checkFollowUser) {
                    return this.Response(RESPONSE_UNFOLLOW_TOPIC, "user not found", 404)
               }
               if (checkFollowUser.activity === "offline") {
                    return this.Response(RESPONSE_UNFOLLOW_TOPIC, "user is suspended", 422)
               }
               return this.Response_With_Data(UNFOLLOW_USER_SERVICES, 200, "RESPONSE_UNFOLLOW_TOPIC", { auth_id: checkAuth.auth_id, unfollow_user: checkFollowUser.auth_id })

          })
     }

     public async ALL_FOLLOW(data: any): Promise<any> {

          const { user } = data;
          const checkAuth = await prisma.auth.findFirst({ where: { auth_id: Number(user) } })
          if (!checkAuth) {
               return this.Response(RESPONSE_ALL_FOLLOW_TOPIC, "User not found", 404)
          }
          this.Response_With_Data(ALL_FOLLOW_USER_SERVICES, 200, "RESPONSE_ALL_FOLLOW_TOPIC", { auth_id: checkAuth.auth_id })


     }

     public async ALL_FOLLOWING(data: any): Promise<any> {

          const { user } = data;
          const checkAuth = await prisma.auth.findFirst({ where: { auth_id: Number(user) } })
          if (!checkAuth) {
               return this.Response(RESPONSE_ALL_FOLLOWING_TOPIC, "User not found", 404)
          }
          this.Response_With_Data(ALL_FOLLOWING_USER_SERVICES, 200, "RESPONSE_ALL_FOLLOWING_TOPIC", { auth_id: checkAuth.auth_id })
     }




     ///////////////////////////// TWEET TOPIC /////////////////////////////


}

export {
     Auth_Controller
}