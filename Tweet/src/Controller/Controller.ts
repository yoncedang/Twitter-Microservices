import { PrismaClient } from "@prisma/client";
import { RedisClass } from "../Redis/Redis";
import { v4 as uuidv4 } from "uuid";
import { KafkaProducer } from "../Kafka/Producer";
import { app } from "../Config/Firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { CONSUMER } from "../Kafka/TOPIC";
import { EDIT_TWEET, CREATE_TWEET, DELETE_TWEET, CHECK_TWEET, RE_TWEET, UN_RETWEET } from "../Interface/Interface";
import { ElasticsearchService } from "../ElasticSearch/Elasticsearch";


const { RESPONSE_CHECK_TWEET, RESPONSE_TWEET_TOPIC } = CONSUMER;

const elastic = new ElasticsearchService();
const prisma = new PrismaClient();
const redis: RedisClass = new RedisClass();
const producer: KafkaProducer = new KafkaProducer();
const uuid = uuidv4();
const storage = getStorage(app);


class Tweet_Controller {
     private async Response(topic: string, message: string, status: number) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status })
     }

     private async Response_With_Data(topic: string, status: number, message: any, data: any) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status, data })
     }

     private async Create_Tweet_Elastic(data: any) {
          const indexExists = await elastic.esClient.indices.exists({
               index: "tweet",
          });
          if (!indexExists) {
               await elastic.esClient.indices.create({
                    index: "tweet",
               });
               await elastic.esClient.index({
                    index: "tweet",
                    id: data?.tweet_id.toString(), // Sử dụng tweet_id làm ID
                    body: {
                         data,
                    },
               });
          }
          await elastic.esClient.index({
               index: "tweet",
               id: data?.tweet_id.toString(), // Sử dụng tweet_id làm ID
               body: {
                    data,
               },
          });

     } /// Create tweet in ElasticSearch

     public async CREATE_TWEET(data: any): Promise<boolean | void> {
          console.log("Tweet Controller", data)
          const { auth_id, content, URL }: CREATE_TWEET = data;

          const hashtags = content?.replace(/,/g, '').match(/#[^\s#]+/g); // Loai bo dau phay va lay hashtag #
          const tweet = await prisma.tweet.create({
               data: {
                    auth_id,
                    content,
               },
               include: {
                    Hashtag: true,
               }
          })

          if (!tweet) return await this.Response(RESPONSE_TWEET_TOPIC, "Create tweet fail", 400)
          await prisma.countRetweet.create({
               data: {
                    tweet_id: tweet.tweet_id,
               }
          })
          if (hashtags) {
               await prisma.hashtag.createMany({
                    data: hashtags.map((hashtag: string) => ({
                         tweet_id: tweet.tweet_id,
                         tag: hashtag,
                    }))
               })
          }
          if (URL) {
               const mediaType = URL[0].message === "IMAGE" ? "image" : "video";
               const filterData = URL.filter((item: any) => !item.message);
               if (filterData.length > 0) {
                    if (mediaType === "image") {
                         await prisma.image.createMany({
                              data: filterData.map((item: any) => ({
                                   tweet_id: tweet.tweet_id,
                                   url: item,
                              })),
                         });
                    } else if (mediaType === "video") {
                         await prisma.video.createMany({
                              data: filterData.map((item: any) => ({
                                   tweet_id: tweet.tweet_id,
                                   url: item,
                              })),
                         });
                    }
               }
          }


          const getTweet = await prisma.tweet.findFirst({
               where: { tweet_id: tweet.tweet_id },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
                    CountRetweet: true,
               }
          })
          this.Create_Tweet_Elastic(getTweet)

          return await this.Response_With_Data(RESPONSE_TWEET_TOPIC, 200, "Create tweet success", getTweet)
     }

     public async DELETE_TWEET(data: any): Promise<boolean | void> {
          const { topic, tweet_id, auth_id }: DELETE_TWEET = data;
          const findTweet = await prisma.tweet.findFirst({
               where: { tweet_id: Number(tweet_id), auth_id },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
                    CountRetweet: true,
               }
          })

          if (!findTweet) return await this.Response(topic, "Tweet not found", 400)
          const { Hashtag, Image, Video, CountRetweet } = findTweet;

          if (CountRetweet) {
               await prisma.countRetweet.deleteMany({
                    where: { tweet_id: findTweet.tweet_id },
               })
          }

          if (Hashtag) {
               await prisma.hashtag.deleteMany({
                    where: { tweet_id: findTweet.tweet_id },
               });
          }
          if (Image) {
               // get url: https://firebasestorage.googleapis.com/v0/b/shop-cart-a2bcc.appspot.com/o/tweet%2Fimg%2F7275766762665987.jpeg?alt=media&token=d13cc455-f4ee-4e3b-a058-a91b965c47e3
               const checkURL = Image.map((item: any) => item.url)
               // get path: tweet%2Fimg%2F7275766762665987.jpeg
               const getPath = checkURL.map((item: any) => item.substring(item.lastIndexOf('/') + 1).split("?")[0])
               // decode path: tweet/img/7275766762665987.jpeg
               const realPath = getPath.map((path: string) => decodeURIComponent(path))
               // Delete file image in firebase storage

               await prisma.image.deleteMany({
                    where: { tweet_id: findTweet.tweet_id },
               });

               Promise.all(realPath.map(async (filePath) => {
                    const fileRef = ref(storage, filePath);

                    try {
                         await deleteObject(fileRef);
                         console.log(`File ${filePath} deleted successfully.`);
                    } catch (error: any) {
                         console.error(`Error deleting file ${filePath}: ${error.message}`);
                    }
               }));
          }
          if (Video) {
               // get url: https://firebasestorage.googleapis.com/v0/b/shop-cart-a2bcc.appspot.com/o/tweet%2Fimg%2F7275766762665987.jpeg?alt=media&token=d13cc455-f4ee-4e3b-a058-a91b965c47e3
               const checkURL = Video.map((item: any) => item.url)
               // get path: tweet%2Fimg%2F7275766762665987.mp4
               const getPath = checkURL.map((item: any) => item.substring(item.lastIndexOf('/') + 1).split("?")[0])

               // decode path: tweet/video/7275766762665987.mp4
               const realPath = getPath.map((path: string) => decodeURIComponent(path))

               Promise.all(realPath.map(async (filePath) => {
                    const fileRef = ref(storage, filePath);
                    try {
                         await deleteObject(fileRef);
                         console.log(`File ${filePath} deleted successfully.`);
                    } catch (error: any) {
                         console.error(`Error deleting file ${filePath}: ${error.message}`);
                    }
               }));

               await prisma.video.deleteMany({
                    where: { tweet_id: findTweet.tweet_id },
               });
          }

          const checkTweetRetweet = await prisma.tweet.findMany({
               where: { retweet_id: Number(tweet_id), type: "Retweet" },
          })
          for (const item of checkTweetRetweet) {
               await prisma.tweet.updateMany({
                    where: { tweet_id: item.tweet_id, type: "Retweet" },
                    data: {
                         retweet_id: null,
                    }
               })
               await prisma.retweet.deleteMany({
                    where: { tweet_id: findTweet.tweet_id },
               })
               await elastic.esClient.update({
                    index: "tweet",
                    id: item.tweet_id.toString(),
                    body: {
                         script: {
                              source: "ctx._source.data.retweet_id = null"
                         }
                    }
               })
          }
          await redis.SET_REDIS(uuid + "-DEL-INTERACT", "Can't set value") // Set token verify on Redis
          await producer.sendMessage("DEL_INTERACT", uuid + "-DEL-INTERACT", Number(tweet_id))
          await prisma.tweet.delete({
               where: { tweet_id: findTweet.tweet_id },
          })

          await elastic.esClient.delete({
               index: "tweet",
               id: findTweet.tweet_id.toString(),
          })

          return await this.Response(topic, "Delete tweet success", 200)
     }

     public async CHECK_TWEET(data: any): Promise<boolean | void> {
          const { tweet, auth_id }: CHECK_TWEET = data;
          const findTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet), auth_id: parseInt(auth_id) },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
               }
          })
          if (!findTweet) return await this.Response("RESPONSE_CHECK_TWEET", "Tweet not found", 404)
          return await this.Response("RESPONSE_CHECK_TWEET", "Tweet found", 200)
     }


     public async EDIT_TWEET(data: any): Promise<boolean | void> {
          const { tweet_id, auth_id, content, URL }: EDIT_TWEET = data;


          if (content) {
               await prisma.hashtag.deleteMany({
                    where: { tweet_id: parseInt(tweet_id) },
               })
               const hashtags = content.replace(/,/g, '').match(/#[^\s#]+/g); // Loai bo dau phay va lay hashtag #
               const editTweet = await prisma.tweet.update({
                    where: { tweet_id: parseInt(tweet_id), auth_id },
                    data: { content }
               })
               if (!editTweet) return await this.Response(RESPONSE_CHECK_TWEET, "Edit tweet fail", 400)
               if (hashtags) {
                    await prisma.hashtag.createMany({
                         data: hashtags.map((hashtag: string) => ({
                              tweet_id: parseInt(tweet_id),
                              tag: hashtag,
                         }))
                    })
               }
          }


          if (URL) {
               const checkImage = await prisma.image.findMany({
                    where: { tweet_id: parseInt(tweet_id) },
               })
               const checkVideo = await prisma.video.findMany({
                    where: { tweet_id: parseInt(tweet_id) },
               })

               if (checkImage.length > 0) {
                    const checkURL = checkImage.map((item: any) => item.url)
                    const getPath = checkURL.map((item: any) => item.substring(item.lastIndexOf('/') + 1).split("?")[0])
                    const realPath = getPath.map((path: string) => decodeURIComponent(path))

                    Promise.all(realPath.map(async (filePath) => {
                         const fileRef = ref(storage, filePath);
                         try {
                              await deleteObject(fileRef);
                              console.log(`File ${filePath} deleted successfully.`);
                         } catch (error: any) {
                              console.error(`Error deleting file ${filePath}: ${error.message}`);
                         }
                    }))

                    await prisma.image.deleteMany({
                         where: { tweet_id: parseInt(tweet_id) },
                    })

                    if (URL[0].message === "IMAGE") {
                         const filterData = URL.filter((item: any) => !item.message)

                         await prisma.image.createMany({
                              data: filterData.map((item: any) => ({
                                   tweet_id: parseInt(tweet_id),
                                   url: item,
                              }))
                         })
                    }
                    if (URL[0].message === "VIDEO") {
                         const filterData = URL.filter((item: any) => !item.message);
                         console.log("OK", filterData);
                         await prisma.video.create({
                              data: {
                                   tweet_id: parseInt(tweet_id),
                                   url: filterData[0],
                              }
                         })
                    }
               }
               if (checkVideo.length > 0) {
                    const checkURL = checkVideo.map((item: any) => item.url)
                    const getPath = checkURL.map((item: any) => item.substring(item.lastIndexOf('/') + 1).split("?")[0])
                    const realPath = getPath.map((path: string) => decodeURIComponent(path))

                    Promise.all(realPath.map(async (filePath) => {
                         const fileRef = ref(storage, filePath);
                         try {
                              await deleteObject(fileRef);
                              console.log(`File ${filePath} deleted successfully.`);
                         } catch (error: any) {
                              console.error(`Error deleting file ${filePath}: ${error.message}`);
                         }
                    }))

                    if (URL[0].message === "IMAGE") {
                         const filterData = URL.filter((item: any) => !item.message)

                         await prisma.video.deleteMany({
                              where: { tweet_id: parseInt(tweet_id) },
                         })
                         await prisma.image.createMany({
                              data: filterData.map((item: any) => ({
                                   tweet_id: parseInt(tweet_id),
                                   url: item,
                              }))
                         })
                    }
                    if (URL[0].message === "VIDEO") {
                         const filterData = URL.filter((item: any) => !item.message);
                         console.log("OK", filterData[0]);

                         await prisma.video.update({
                              where: { tweet_id: parseInt(tweet_id), video_id: checkVideo[0].video_id },
                              data: {
                                   url: filterData[0],
                              }
                         })
                    }

               }
               if (checkImage.length === 0 && checkVideo.length === 0) {
                    if (URL[0].message === "IMAGE") {
                         const filterData = URL.filter((item: any) => !item.message)

                         await prisma.image.createMany({
                              data: filterData.map((item: any) => ({
                                   tweet_id: parseInt(tweet_id),
                                   url: item,
                              }))
                         })
                    }
                    if (URL[0].message === "VIDEO") {
                         const filterData = URL.filter((item: any) => !item.message);
                         console.log("OK", filterData);
                         await prisma.video.create({
                              data: {
                                   tweet_id: parseInt(tweet_id),
                                   url: filterData[0],
                              }
                         })
                    }
               }
          }

          const tweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id), auth_id },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
                    CountRetweet: true,
               }
          })
          await elastic.esClient.update({
               index: "tweet",
               id: tweet_id.toString(),
               body: {
                    doc: {
                         data: tweet,
                    }
               },
          })

          return await this.Response_With_Data(RESPONSE_CHECK_TWEET, 200, "Edit tweet success", tweet)
     }



     private async create_tweet(tweet_id: string, content: string, auth_id: number, topic: string) {
          const checkTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id) },
          })
          if (!checkTweet) return await this.Response(topic, "Tweet not found", 404)
          const hashtags = content?.replace(/,/g, '').match(/#[^\s#]+/g); // Loai bo dau phay va lay hashtag #
          const tweet = await prisma.tweet.create({
               data: {
                    auth_id,
                    content,
                    type: "Retweet",
                    retweet_id: parseInt(tweet_id),
               },
               include: {
                    Hashtag: true,
               }
          })
          if (!tweet) return await this.Response(topic, "Create tweet fail", 400)
          await prisma.countRetweet.create({
               data: {
                    tweet_id: tweet.tweet_id,
                    count: 0,
               }
          })
          if (hashtags) {
               await prisma.hashtag.createMany({
                    data: hashtags.map((hashtag: string) => ({
                         tweet_id: tweet.tweet_id,
                         tag: hashtag,
                    }))
               })
          }
          const getTweet = await prisma.tweet.findFirst({
               where: { tweet_id: tweet.tweet_id },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
                    CountRetweet: true,
               }
          })
          await this.Create_Tweet_Elastic(getTweet)
          return tweet;
     }

     private async retweetANDcount(tweet_id: string, auth_id: number, CHECK_TWEET: any) {
          await prisma.retweet.create({
               data: {
                    auth_id,
                    tweet_id: parseInt(tweet_id),
               }
          })

          await prisma.countRetweet.updateMany({
               where: { tweet_id: CHECK_TWEET.tweet_id },
               data: {
                    count: {
                         increment: 1,
                    }
               }
          })
          // update count retweet in elastic
          await elastic.esClient.update({
               index: "tweet",
               id: CHECK_TWEET.tweet_id.toString(),
               body: {
                    script: {
                         source: "ctx._source.data.CountRetweet[0].count++"
                    }
               }
          })

     }

     public async RE_TWEET(data: any): Promise<boolean | void> {
          const { tweet_id, content, auth_id, topic }: RE_TWEET = data;

          const CHECK_TWEET = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id) },
          })
          if (!CHECK_TWEET) return await this.Response(topic, "Tweet not found", 404)


          const checkRetweet = await prisma.retweet.findFirst({
               where: { tweet_id: parseInt(tweet_id), auth_id },
          })
          if (checkRetweet) return await this.Response(topic, "You already Retweet this Tweet", 422)

          const tweet = await this.create_tweet(tweet_id, content, auth_id, topic)
          await this.retweetANDcount(tweet_id, auth_id, CHECK_TWEET)

          return await this.Response_With_Data(topic, 200, "Retweet success", tweet)

     }

     public async UN_RETWEET(data: any): Promise<boolean | void> {
          console.log("Un-Retweet", data)
          const { tweet_id, auth_id, topic }: UN_RETWEET = data;
          const checkTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id) },
          })
          if (!checkTweet) return await this.Response(topic, "Tweet not found", 404)

          const checkTweetRetweet = await prisma.tweet.findFirst({
               where: { retweet_id: parseInt(tweet_id), type: "Retweet", auth_id },
          })
          if (!checkTweetRetweet) return await this.Response(topic, "Retweet not found", 404)
          await prisma.$transaction([
               prisma.hashtag.deleteMany({
                    where: { tweet_id: checkTweetRetweet.tweet_id },
               }),
               prisma.tweet.delete({
                    where: { tweet_id: checkTweetRetweet.tweet_id, type: "Retweet" },
               }),
               prisma.retweet.deleteMany({
                    where: { tweet_id: checkTweet.tweet_id, auth_id },
               }),
               prisma.countRetweet.updateMany({
                    where: { tweet_id: checkTweet.tweet_id },
                    data: { count: { decrement: 1 } },
               }),
          ]);
          await elastic.esClient.delete({
               index: "tweet",
               id: checkTweetRetweet.tweet_id.toString(),
          })

          await elastic.esClient.update({
               index: "tweet",
               id: checkTweet.tweet_id.toString(),
               body: {
                    script: {
                         source: "ctx._source.data.CountRetweet[0].count--"
                    }
               }
          })
          return await this.Response(topic, "Un-Retweet success", 200)
     }

     public async CHECKTWEET_LIKE_COMMENT(data: any): Promise<boolean | void> {
          console.log("data", data)
          const { tweet_id, auth_id, topic } = data;
          const findTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id) },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
               }
          })
          if (!findTweet) return await this.Response(topic, "Tweet not found", 404)
          await this.Response_With_Data("TWEET_OK", 200, "OK", { auth_id, tweet_id, topic })
     }

     public async CHECK_TWEET_GET_COMMENT(data: any): Promise<boolean | void> {
          const { tweet, topic } = data;
          const findTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet) },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
               }
          })
          if (!findTweet) return await this.Response(topic, "Tweet not found", 404)
          await this.Response_With_Data("GET_ALL_COMMENT_TOPIC", 200, "OK", { tweet, topic })
     }

     public async CHECK_FOR_COMMENT(data: any): Promise<boolean | void> {
          const { tweet_id, auth_id, content, topic } = data;
          const checkTweet = await prisma.tweet.findFirst({
               where: { tweet_id: parseInt(tweet_id) },
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
               }
          })
          if (!checkTweet) return await this.Response(topic, "Tweet not found", 404)
          await this.Response_With_Data("COMMENT_TWEET_TOPIC", 200, "OK", { auth_id, tweet_id, content, topic })
     }

     public async GET_TWEET_ID(data: any): Promise<boolean | void> {
          const { tweet_id, topic } = data;
          try {
               const findTweet = await elastic.esClient.get({
                    index: "tweet",
                    id: tweet_id.toString(),
               });
               return await this.Response_With_Data(topic, 200, "Tweet found", findTweet.body._source);
          } catch (error: any) {
               if (error.statusCode === 404) {
                    return await this.Response(topic, "Tweet not found", 404);
               } else {
                    throw error.message; // Nếu không phải trạng thái 404, ném lỗi lên để xử lý sau này
               }
          }
     }

     public async NAV_TWEET(data: any): Promise<boolean | void> {
          const { page, topic } = data;

          const size = 15;
          const currentPage = parseInt(page);
          const offset = (currentPage - 1) * size;

          const totalTweet = await prisma.tweet.count();
          const totalPages = Math.ceil(totalTweet / size);

          const tweets = await prisma.tweet.findMany({
               skip: offset,
               take: size,
               include: {
                    Hashtag: true,
                    Image: true,
                    Video: true,
                    CountRetweet: true,
               }
          })
          if (!tweets) return await this.Response(topic, "Tweet not found", 404)
          const results = {
               totalTweet,
               totalPages,
               currentPage,
               tweets,
          };
          if (page > totalPages) return await this.Response(topic, "Page not found", 404)
          return await this.Response_With_Data(topic, 200, "Tweet found", results);

     }
}

export {
     Tweet_Controller
}