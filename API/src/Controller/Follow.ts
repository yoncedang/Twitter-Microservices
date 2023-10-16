import { Response_Clients } from "../Config/Response";
import { Request, Response } from "express";
import { KafkaConsumer } from "../Kafka/Consumer";

const response = new Response_Clients();
const consumer = new KafkaConsumer();


class Follow {
     public async FOLLOW_USER(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async UNFOLLOW_USER(req: Request, res: Response): Promise<any> {
          try {
               const data = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = data;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }
     
     public async ALL_FOLLOW(req: Request, res: Response): Promise<any> {
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
     
     public async ALL_FOLLOWING(req: Request, res: Response): Promise<any> {
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
}


export {
     Follow
}