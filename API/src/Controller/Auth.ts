

import { Response_Clients } from "../Config/Response";
import { Request, Response } from "express";
import { KafkaConsumer } from "../Kafka/Consumer";
import { Jsonwebtoken } from "../Config/JWT";
import { RedisClass } from "../Redis/Redis";
import { ElasticsearchService } from "../ElasticSearch/Elasticsearch";

const elastic = new ElasticsearchService();
const redis = new RedisClass();
const jwt = new Jsonwebtoken();
const response = new Response_Clients();
const consumer = new KafkaConsumer();

class Auth {

     public async SIGNUP_CONSUME(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               const parts = message.split(": ");
               const email = parts[1];
               await res.cookie("email", email, { maxAge: 3600000 })

               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async VERIFY_EMAIL(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               res.clearCookie("email")
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async VERIFY_OTP(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               res.clearCookie("email")
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async REQUEST_VERIFICATION(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               if (status === 422) {
                    res.clearCookie("email")
                    return response.General_Response(res, status, message)
               }
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async FORGOT_PASSWORD(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;

               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async RESET_PASSWORD(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;

               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async LOGIN_ACCOUNT(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, accessToken, auth_id } = data;
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               await res.cookie("accessToken", accessToken)
               return response.Success(res, status, { auth_id }, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async REQUEST_ACCESSTOKEN(req: Request, res: Response): Promise<any> {
          try {
               const { auth_id } = req.body;
               const getRefresh: any = await redis.GET_REDIS(auth_id);
               if (!getRefresh) {
                    return response.General_Response(res, 401, "Refresh Token Expired - Please Login Again")
               }

               await jwt.JWT_VERIFY_REFRESH_TOKEN(getRefresh, async (err: any, data: any) => {
                    if (err) {
                         return response.General_Response(res, 401, "Invalid Refresh Token - Please Login Again")
                    }
                    const accessToken = await jwt.ACCESS_TOKEN({ value: data.value })
                    await res.cookie("accessToken", accessToken)
                    return response.General_Response(res, 200, "Access Token Refreshed")
               });

          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async CHANGE_PASSWORD(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async UPDATE_PROFILE(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async CHANGE_EMAIL(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async VERIFY_CHANGE_EMAIL(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async GET_USER(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, data, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async DEL_USER(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async SUSPENDED_USER(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async UNSUSPENDED_USER(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async GET_ALL_USER(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, data, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async LOGOUT(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               await res.clearCookie("accessToken")
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async SET_AVATAR(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async GET_USERNAME(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, user } = value;
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, user, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async elasticSearch(req: Request, res: Response): Promise<any> {
          const { search } = req.query;
          const results = [];

          // Thử tìm kiếm theo username trong index "user"
          const userResponse = await elastic.esClient.search({
               index: 'user',
               body: {
                    query: {
                         match: {
                              "data.Profile.username": search
                         }
                    }
               }
          });
          if (userResponse.body.hits.total.value > 0) {
               // Nếu tìm thấy username, lấy user_id
               const auth_id = userResponse.body.hits.hits[0]._source.data.auth_id;

               // Thêm thông tin từ index "user" vào mảng kết quả
               results.push(userResponse.body.hits.hits[0]._source.data);

               // Tiếp tục tìm kiếm tweet bằng user_id trong index "tweet"
               const tweetResponse = await elastic.esClient.search({
                    index: 'tweet',
                    body: {
                         query: {
                              match: {
                                   "data.auth_id": auth_id
                              }
                         }
                    }
               });
               if (tweetResponse.body.hits.total.value === 0) {
                    results.push({ tweet: "No tweet data found for this User" });
               } else if (tweetResponse.body.hits.hits.length > 0) {
                    results.push(tweetResponse.body.hits.hits[0]._source.data);
               } else {
                    results.push("No tweet data found for this User");
               }
          } else {
               // Nếu không tìm thấy username, thử tìm kiếm theo nội dung tweet trong index "tweet"
               const tweetResponse = await elastic.esClient.search({
                    index: 'tweet',
                    body: {
                         query: {
                              match: {
                                   "data.content": search
                              }
                         }
                    }
               });
               if (tweetResponse.body.hits.total.value === 0) {
                    return await response.General_Response(res, 404, "Not match any result")
               } else if (tweetResponse.body.hits.hits.length > 0) {
                    results.push(tweetResponse.body.hits.hits[0]._source.data);
               } else {
                    return await response.General_Response(res, 404, "Not match any result")
               }
               // Thêm thông tin từ index "tweet" vào mảng kết quả

          }
          return await response.Success(res, 200, results, "Search Success")
     }

     public async GET_USER_BY_ID(req: Request, res: Response): Promise<any> {
          const { auth_id } = req.query;
          const results = await elastic.esClient.search({
               index: 'user',
               body: {
                    query: {
                         match: {
                              "data.auth_id": auth_id
                         }
                    }
               }
          })
          if (results.body.hits.total.value === 0) {
               return await response.General_Response(res, 404, "Not match any result")
          } else if (results.body.hits.hits.length > 0) {
               return await response.Success(res, 200, results.body.hits.hits[0]._source.data, "Search Success")
          } else {
               return await response.General_Response(res, 404, "Not match any result")
          }
     }
}

export {
     Auth
}