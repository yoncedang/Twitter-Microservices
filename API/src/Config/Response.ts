import { Response } from "express"




class Response_Clients {

     public async General_Response(res: Response, code: number, message: any) {
          return res.status(code).json({
               message,
          })
     }

     public async Success(res: Response, code: number, data: any, message: string) {
          return res.status(code).json({
               message,
               data
          })
     }

     public async Internal_Server_Error(res: Response, error: any, message: string) {
          return res.status(500).json({
               message,
               error: error.message,
          })
     }
}

export {
     Response_Clients
};