import dotenv from 'dotenv';
dotenv.config();





const API_PORT = process.env.API_PORT || 3003;


const RedisClient: any = {
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     password: process.env.REDIS_PASSWORD,
}
const HOST_ADRESS = process.env.HOST_ADRESS;

export {
     API_PORT,
     RedisClient,
     HOST_ADRESS
}


