import dotenv from 'dotenv';
dotenv.config();





const API_PORT = process.env.API_PORT || 3001;





const RedisClient: any = {
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     password: process.env.REDIS_PASSWORD,
}



const JWT_Client: any = {
     secret: process.env.JWT_SECRET,
     access: process.env.JWT_ACCESS,
     refresh: process.env.JWT_REFRESH,
}


const DigitalOcean: any = {
     accessKeyId: process.env.accessKeyId,
     secretAccessKey: process.env.secretAccessKey,

}

export {
     API_PORT,
     RedisClient,
     JWT_Client,
     DigitalOcean
}


