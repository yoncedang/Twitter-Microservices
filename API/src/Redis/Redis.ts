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

          this.redis.on('error', (error) => {
               console.error('Error connecting to Redis:', error);
          });
     }

     public async SET_REDIS (key: string, value: string): Promise<String> {
          return await this.redis.set(key, value, "EX", 3600)
     }

     public async GET_REDIS (key: string): Promise<String | null> {
          return await this.redis.get(key)
     }

     public async DEL_REDIS (key: string): Promise<number> {
          return await this.redis.del(key)
     }

}

export {
     RedisClass
}