import { Redis } from "ioredis";
import { RedisClient } from "../Config/Config";

class RedisClass {
     private redis: Redis;
     private RedisClient: any = RedisClient;


     constructor () {
          const { host, port, password } = this.RedisClient
          const URL = `redis://:${password}@${host}:${port}`

          this.redis = new Redis(URL)
          // this.connect();
     }

     public connect (): void {
          this.redis.on('connect', () => {
               console.log('Connected to Redis');
          });

          this.redis.on('error', (error: any) => {
               console.error('Error connecting to Redis:', error.message);
          });
     }

     public async SET_REDIS (key: string, value: string): Promise<any> {
          return await this.redis.set(key, value, "EX", 3600)
     }

     public async SET_REFRESH (key: any, value: string): Promise<any> {
          return await this.redis.set(key, value, "EX", 365 * 24 * 60 * 60)
     }

     public async GET_REDIS (key: string): Promise<any> {
          return await this.redis.get(key)
     }

     public async DEL_REDIS (key: string): Promise<any> {
          return await this.redis.del(key)
     }

}

export {
     RedisClass
}