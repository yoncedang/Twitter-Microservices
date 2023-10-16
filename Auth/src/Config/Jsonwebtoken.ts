import jwt from 'jsonwebtoken';
import { JWT_Client } from './Config';
import { JWT_type } from '../Interface/Interface';

const { access, refresh, secret }: JWT_type = JWT_Client

class Jsonwebtoken {

     public async JWT_VERIFY_ACCOUNT(payload: any): Promise<string> {
          return await jwt.sign(payload, secret, { expiresIn: 3600 })
     }
     public async JWT_VERIFY_EMAIL(token: string, callback: (err: any, value: any) => Promise<any>): Promise<any> {
          return await jwt.verify(token, secret, callback)
     }

     public async JWT_CRACK(token: string): Promise<any> {
          return await jwt.decode(token)
     }

     public async JWT_VERIFY(token: string, callback: (err: any, value: any) => Promise<any>): Promise<any> {
          return await jwt.verify(token, access, callback)
     }

     public async JWT_VERIFY_REFRESH_TOKEN(token: string, callback: (err: any, value: any) => Promise<any>): Promise<any> {
          return await jwt.verify(token, refresh, callback)
     }

     public async ACCESS_TOKEN(payload: any): Promise<string> {
          return await jwt.sign(payload, access, { expiresIn: 60 })
     }

     public async REFRESH_TOKEN(payload: any): Promise<string> {
          return await jwt.sign(payload, refresh, { expiresIn: "365d" })
     }
}


export {
     Jsonwebtoken
}