import { PrismaClient } from "@prisma/client";
import { RedisClass } from "../Redis/Redis";
import { v4 as uuidv4 } from "uuid";
import { KafkaProducer } from "../Kafka/Producer";
import { ElasticsearchService } from "../ElasticSearch/Elasticsearch";
import { CONSUMER } from "../Kafka/TOPIC";



const elastic = new ElasticsearchService();
const prisma = new PrismaClient();
const redis: RedisClass = new RedisClass();
const producer: KafkaProducer = new KafkaProducer();
const uuid = uuidv4();



class Like_Comment_Controller {
     private async Response(topic: string, message: string, status: number) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status })
     }

     private async Response_With_Data(topic: string, status: number, message: any, data: any) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status, data })
     }

     public async LIKE_TWEET(value: any) {
          console.log("Like", value)
          const { topic, auth_id, tweet_id, } = value.data

          const checkLikeTweet = await prisma.likes.findFirst({
               where: { auth_id, tweet_id: Number(tweet_id) }
          })
          if (checkLikeTweet) return this.Response(topic, "You already like this tweet", 422)
          const likeTweet = await prisma.likes.create({
               data: {
                    tweet_id: Number(tweet_id),
                    auth_id
               }
          })
          if (!likeTweet) return this.Response(topic, "Somethings wrong to like this Tweet", 400)
          const count = await prisma.likes.count({
               where: { tweet_id: Number(tweet_id) }
          })

          console.log(count)
          const checkTotalLike = await prisma.count.findFirst({
               where: { tweet_id: Number(tweet_id) }
          })
          if (!checkTotalLike) {
               await prisma.count.create({
                    data: {
                         tweet_id: likeTweet.tweet_id,
                         sum_like: count
                    }
               })
          }

          await prisma.count.updateMany({
               where: { tweet_id: likeTweet.tweet_id },
               data: {
                    sum_like: count
               }
          })
          await elastic.esClient.update({
               index: 'tweet',
               id: likeTweet.tweet_id.toString(),
               body: {
                    doc: {
                         "like": [
                              {
                                   "tweet_id": likeTweet.tweet_id,
                                   "total_like": count,
                              },
                         ]
                    }
               }
          })
          return this.Response(topic, "Like Tweet Success", 200)
     }

     public async unLIKE_TWEET(data: any) {
          const { auth_id, tweet_id, topic } = data
          const checkLikeTweet = await prisma.likes.findFirst({
               where: { auth_id, tweet_id: Number(tweet_id) }
          })
          if (!checkLikeTweet) return this.Response(topic, "You do not like this Tweet", 422)
          const unLikeTweet = await prisma.likes.delete({
               where: { like_id: checkLikeTweet.like_id, auth_id, tweet_id: Number(tweet_id) }
          })
          if (!unLikeTweet) return this.Response(topic, "Somethings wrong to unlike this Tweet", 400)
          const count = await prisma.likes.count({
               where: { tweet_id: Number(tweet_id) }
          })
          await prisma.count.updateMany({
               where: { tweet_id: Number(tweet_id) },
               data: {
                    sum_like: count
               }
          })
          await elastic.esClient.update({
               index: 'tweet',
               id: unLikeTweet.tweet_id.toString(),
               body: {
                    doc: {
                         "like": [
                              {
                                   "tweet_id": unLikeTweet.tweet_id,
                                   "total_like": count,
                              },
                         ]
                    }
               }
          })
          return this.Response(topic, "Unlike Tweet Success", 200)
     }

     public async COMMENT_TWEET(data: any) {
          console.log("DATA NE: ", data)
          const { tweet_id, auth_id, content, topic } = data.data
          const commentTweet = await prisma.comments.create({
               data: {
                    tweet_id: Number(tweet_id),
                    auth_id,
                    content
               }
          })
          if (!commentTweet) return this.Response(topic, "Somethings wrong to comment this Tweet", 400)
          const count = await prisma.comments.count({
               where: { tweet_id: Number(tweet_id) }
          })
          const checkTotalLike = await prisma.count.findFirst({
               where: { tweet_id: Number(tweet_id) }
          })
          if (!checkTotalLike) {
               await prisma.count.create({
                    data: {
                         tweet_id: commentTweet.tweet_id,
                         sum_comment: count
                    }
               })
          }
          await prisma.count.updateMany({
               where: { tweet_id: commentTweet.tweet_id },
               data: {
                    sum_comment: count
               }
          })
          const checkComment = await prisma.comments.findMany({
               where: { tweet_id: Number(tweet_id) }
          })
          await elastic.esClient.update({
               index: 'tweet',
               id: commentTweet.tweet_id.toString(),
               body: {
                    doc: {
                         "comments": [
                              {
                                   "total_comment": count,
                                   "data": checkComment
                              },
                         ]
                    }
               }
          })
          return this.Response_With_Data(topic, 200, "Comment Tweet Success", commentTweet)

     }

     public async GET_COMMENT(data: any) {
          const { comment, topic } = data
          const getComment = await prisma.comments.findFirst({
               where: { comment_id: Number(comment) }
          })
          if (!getComment) return this.Response(topic, "Comment not found", 404)
          return this.Response_With_Data(topic, 200, "Get Comment Success", getComment)
     }

     public async DEL_INTERACT(data: any) {

          const checkComment = await prisma.comments.findMany({
               where: { tweet_id: Number(data) }
          })
          const checkLike = await prisma.likes.findMany({
               where: { tweet_id: Number(data) }
          })
          const checkCount = await prisma.count.findFirst({
               where: { tweet_id: Number(data) }
          })
          if (checkComment.length === 0 && checkLike.length === 0 && !checkCount) return
          if (checkComment.length !== 0) {
               await prisma.comments.deleteMany({
                    where: { tweet_id: Number(data) }
               })
          }
          if (checkLike.length !== 0) {
               await prisma.likes.deleteMany({
                    where: { tweet_id: Number(data) }
               })
          }
          if (checkCount) {
               await prisma.count.deleteMany({
                    where: { tweet_id: Number(data) }
               })
          }
          // await redis.DEL_REDIS(data)
     }


     public async DEL_COMMENT(data: any) {
          const { comment, topic, auth_id } = data
          const getComment = await prisma.comments.findFirst({
               where: { comment_id: Number(comment), auth_id }
          })
          if (!getComment) return this.Response(topic, "Comment not found", 404)
          const delComment = await prisma.comments.delete({
               where: { comment_id: Number(comment), auth_id }
          })
          if (!delComment) return this.Response(topic, "Somethings wrong to delete this comment", 400)
          const count = await prisma.comments.count({
               where: { tweet_id: getComment.tweet_id }
          })
          await prisma.count.updateMany({
               where: { tweet_id: getComment.tweet_id },
               data: {
                    sum_comment: count
               }
          })

          const response = await elastic.esClient.get({
               index: 'tweet',
               type: '_doc',
               id: getComment.tweet_id.toString()
          })
          const checkComment = response.body._source.comments[0].data
          const filterDel = checkComment.filter((item: any) => item.comment_id !== Number(comment))
          await elastic.esClient.update({
               index: 'tweet',
               id: getComment.tweet_id.toString(),
               body: {
                    doc: {
                         "comments": [
                              {
                                   "total_comment": count,
                                   "data": filterDel
                              },
                         ]
                    }
               }
          })


          return this.Response(topic, "Delete Comment Success", 200)

     }

     public async EDIT_COMMENT(data: any) {
          const { comment, topic, auth_id, content } = data
          const checkComment = await prisma.comments.findFirst({
               where: { comment_id: Number(comment), auth_id }
          })
          if (!checkComment) return this.Response(topic, "Comment not found", 404)
          const editComment = await prisma.comments.update({
               where: { comment_id: Number(comment), auth_id },
               data: {
                    content,
                    updatedat: new Date()
               }
          })
          /// Update content comment in Elasticsearch
          const checkCommentElastic = await prisma.comments.findMany({
               where: { tweet_id: checkComment.tweet_id }
          })
          await elastic.esClient.update({
               index: 'tweet',
               id: checkComment.tweet_id.toString(),
               body: {
                    doc: {
                         "comments": [
                              {
                                   "data": checkCommentElastic
                              },
                         ]
                    }
               }
          })


          if (!editComment) return this.Response(topic, "Somethings wrong to edit this comment", 400)
          return this.Response_With_Data(topic, 200, "Edit Comment Success", editComment)
     }

     public async ALL_COMMENT_TWEET(data: any) {
          const { tweet, topic } = data.data
          const allComment = await prisma.comments.findMany({
               where: { tweet_id: Number(tweet) }
          })
          if (allComment.length === 0) return this.Response(topic, "Comment not found", 404)
          return this.Response_With_Data(topic, 200, "Get All Comment Success", allComment)
     }
}

export {
     Like_Comment_Controller
}