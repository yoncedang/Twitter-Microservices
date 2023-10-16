import { Response_Clients } from "../Config/Response";
import { Request, Response } from "express";
import { KafkaConsumer } from "../Kafka/Consumer";
import { ElasticsearchService } from "../ElasticSearch/Elasticsearch";

const response = new Response_Clients();
const consumer = new KafkaConsumer();
const elastic = new ElasticsearchService();

class Tweet {
     public async CREATE_TWEET(req: Request, res: Response): Promise<any> {
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
     public async DELETE_TWEET(req: Request, res: Response): Promise<any> {
          try {
               const value = await consumer.GET_RECEIVED_MESSAGE();
               const { status, message } = value;
               return response.General_Response(res, status, message)
          } catch (error: any) {
               return await response.Internal_Server_Error(res, error.message, "Internal Server Error nha")
          }
     }

     public async EDIT_TWEET(req: Request, res: Response): Promise<any> {
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
     public async RE_TWEET(req: Request, res: Response): Promise<any> {
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
     public async UN_RETWEET(req: Request, res: Response): Promise<any> {
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

     public async GET_TWEET_BY_ID(req: Request, res: Response): Promise<any> {
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

     public async NAV_TWEET(req: Request, res: Response): Promise<any> {
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

     public async Search_by_Content(req: Request, res: Response): Promise<any> {
          const { content }: any = req.query;

          const result = await elastic.esClient.search({
               index: 'tweet',
               body: {
                    query: {
                         match: {
                              "data.content": content
                         }
                    },
               },
          });

          const { hits } = result.body.hits;

          const data = hits.map((item: any) => item._source.data);
          if (data.length === 0) return response.General_Response(res, 404, "Not found")
          return response.Success(res, 200, data, "Search tweet by content success");
     }

}


export {
     Tweet
}
