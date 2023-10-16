import { Response_Clients } from "../Config/Response";
import { Request, Response } from "express";
import { KafkaConsumer } from "../Kafka/Consumer";

const response = new Response_Clients();
const consumer = new KafkaConsumer();



class LIKE_COMMENT {

     public async LIKE_TWEET(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = value;
               return response.General_Response(res, status, message)

          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }
     public async COMMENT_TWEET(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               console.log("Ok", value)
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, data, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async unLIKE_TWEET(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = value;
               return response.General_Response(res, status, message)

          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async GET_COMMENT(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               console.log("Ok", value)
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, data, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }
     public async EDIT_COMMENT(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               console.log("Ok", value)
               if (status !== 200) {
                    return response.General_Response(res, status, message)
               }
               return response.Success(res, status, data, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async DEL_COMMENT(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = value;
               return response.General_Response(res, status, message)

          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async GET_ALL_COMMENT(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message, data } = value;
               console.log("Ok", value)
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
     LIKE_COMMENT
}