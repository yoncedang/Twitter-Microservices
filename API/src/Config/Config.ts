import dotenv from 'dotenv';
dotenv.config();





const API_PORT = process.env.API_PORT || 8888;




const RedisClient: any = {
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     password: process.env.REDIS_PASSWORD,

}

const JWT_Client: any = {
     access: process.env.JWT_ACCESS,
     refresh: process.env.JWT_REFRESH,
}

const DigitalOcean: any = {
     accessKeyId: process.env.accessKeyId,
     secretAccessKey: process.env.secretAccessKey,
     endpoint: "https://sgp1.digitaloceanspaces.com",
     region: "sgp1",
     bucket: "twitter",

}

const HOST_ADRESS = process.env.HOST_ADRESS;

export {
     API_PORT,
     RedisClient,
     JWT_Client,
     DigitalOcean,
     HOST_ADRESS
}


