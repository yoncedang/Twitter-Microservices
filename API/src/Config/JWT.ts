import jwt from 'jsonwebtoken';
import { JWT_Client } from './Config';

const { access, refresh } = JWT_Client

class Jsonwebtoken {


     public async JWT_VERIFY(token: string, callback: (err: any, value: any) => Promise<any>): Promise<any> {
          return await jwt.verify(token, access, callback)
     }

     public async JWT_VERIFY_REFRESH_TOKEN(token: string, callback: (err: any, value: any) => Promise<any>): Promise<any> {
          return await jwt.verify(token, refresh, callback)
     }

     public async ACCESS_TOKEN(payload: any): Promise<string> {
          return await jwt.sign(payload, access, { expiresIn: 60 })
     }

}


export {
     Jsonwebtoken
}