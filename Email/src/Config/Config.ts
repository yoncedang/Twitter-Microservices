import dotenv from 'dotenv';
dotenv.config();





const API_PORT = process.env.API_PORT || 9999;



const RedisClient: any = {
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     password: process.env.REDIS_PASSWORD,


}


export {
     API_PORT,
     RedisClient
}


