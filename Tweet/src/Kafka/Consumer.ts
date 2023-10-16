import { Consumer } from "kafkajs";
import { KafkaClient } from "./Kafka";
import { CONSUMER } from "./TOPIC";
import { RedisClass } from "../Redis/Redis";
import { Tweet_Controller } from "../Controller/Controller";



class KafkaConsumer extends KafkaClient {
     private tweet: Tweet_Controller = new Tweet_Controller();
     private redis: RedisClass;
     private consumer: any = CONSUMER;
     private CREATE_TWEET_TOPIC_consumer: Consumer;
     private DELETE_TWEET_TOPIC_SERVICES_consumer: Consumer;
     private CHECK_TWEET_consumer: Consumer;
     private EDIT_TWEET_TOPIC_consumer: Consumer;
     private RETWEET_TOPIC_consumer: Consumer;
     private UNRETWEET_TOPIC_consumer: Consumer;
     private CHECK_TWEET_TOPIC_consumer: Consumer;
     private GET_TWEET_TOPIC_consumer: Consumer;
     private NAV_TWEET_TOPIC_consumer: Consumer;
     private CHECK_TWEET_FOR_COMMENT_TOPIC_consumer: Consumer;
     private CHECK_TWEET_GET_COMMENT_TOPIC_consumer: Consumer;
     constructor() {
          super();
          this.redis = new RedisClass();
          this.CREATE_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'TWEET_TOPIC_SERVICES_consumer', allowAutoTopicCreation: true });
          this.DELETE_TWEET_TOPIC_SERVICES_consumer = this.kafka.consumer({ groupId: 'DELETE_TWEET_TOPIC_SERVICES_consumer', allowAutoTopicCreation: true });
          this.CHECK_TWEET_consumer = this.kafka.consumer({ groupId: 'CHECK_TWEET', allowAutoTopicCreation: true });
          this.EDIT_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'EDIT_TWEET_TOPIC', allowAutoTopicCreation: true });
          this.RETWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'RETWEET_TOPIC', allowAutoTopicCreation: true });
          this.UNRETWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'UNRETWEET_TOPIC', allowAutoTopicCreation: true });
          this.CHECK_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: "CHECK_TWEET_TOPIC", allowAutoTopicCreation: true })
          this.GET_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: "GET_TWEET_TOPIC", allowAutoTopicCreation: true })
          this.NAV_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: "NAV_TWEET_TOPIC", allowAutoTopicCreation: true })
          this.CHECK_TWEET_FOR_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: "CHECK_TWEET_FOR_COMMENT_TOPIC", allowAutoTopicCreation: true })
          this.CHECK_TWEET_GET_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: "CHECK_TWEET_GET_COMMENT_TOPIC", allowAutoTopicCreation: true })
          this.connect();
          this.subscribe();
     }

     private async connect() {
          await this.CREATE_TWEET_TOPIC_consumer.connect();
          await this.DELETE_TWEET_TOPIC_SERVICES_consumer.connect();
          await this.CHECK_TWEET_consumer.connect();
          await this.EDIT_TWEET_TOPIC_consumer.connect();
          await this.RETWEET_TOPIC_consumer.connect();
          await this.UNRETWEET_TOPIC_consumer.connect();
          await this.CHECK_TWEET_TOPIC_consumer.connect();
          await this.GET_TWEET_TOPIC_consumer.connect();
          await this.NAV_TWEET_TOPIC_consumer.connect();
          await this.CHECK_TWEET_FOR_COMMENT_TOPIC_consumer.connect();
          await this.CHECK_TWEET_GET_COMMENT_TOPIC_consumer.connect();
     }

     private async subscribe() {
          Promise.all([
               this.CREATE_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.CREATE_TWEET_TOPIC }),
               this.DELETE_TWEET_TOPIC_SERVICES_consumer.subscribe({ topic: this.consumer.DELETE_TWEET_TOPIC_SERVICES }),
               this.CHECK_TWEET_consumer.subscribe({ topic: this.consumer.CHECK_TWEET }),
               this.EDIT_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.EDIT_TWEET_TOPIC }),
               this.RETWEET_TOPIC_consumer.subscribe({ topic: this.consumer.RETWEET_TOPIC }),
               this.UNRETWEET_TOPIC_consumer.subscribe({ topic: this.consumer.UNRETWEET_TOPIC }),
               this.CHECK_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.CHECK_TWEET_TOPIC }),
               this.GET_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.GET_TWEET_TOPIC }),
               this.NAV_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.NAV_TWEET_TOPIC }),
               this.CHECK_TWEET_FOR_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.CHECK_TWEET_FOR_COMMENT_TOPIC }),
               this.CHECK_TWEET_GET_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.CHECK_TWEET_GET_COMMENT_TOPIC }),
          ])
     }


     public async CREATE_TWEET_CONSUME(): Promise<void> {

          await this.CREATE_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.CREATE_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CREATE_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async DELETE_TWEET_CONSUME(): Promise<void> {

          await this.DELETE_TWEET_TOPIC_SERVICES_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.DELETE_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.DELETE_TWEET_TOPIC_SERVICES_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async CHECK_TWEET_CONSUME(): Promise<void> {

          await this.CHECK_TWEET_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.CHECK_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHECK_TWEET_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async EDIT_TWEET_CONSUME(): Promise<void> {

          await this.EDIT_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.EDIT_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.EDIT_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async RE_TWEET_CONSUME(): Promise<void> {

          await this.RETWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.RE_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RETWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async UNRETWEET_CONSUME(): Promise<void> {

          await this.UNRETWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.UN_RETWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.UNRETWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async CHECKTWEET_CONSUME(): Promise<void> {

          await this.CHECK_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.CHECKTWEET_LIKE_COMMENT(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHECK_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async CHECK_FOR_COMMENT_CONSUME(): Promise<void> {

          await this.CHECK_TWEET_FOR_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.CHECK_FOR_COMMENT(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHECK_TWEET_FOR_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async CHECK_TWEET_GET_COMMENT_CONSUME(): Promise<void> {

          await this.CHECK_TWEET_GET_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.CHECK_TWEET_GET_COMMENT(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHECK_TWEET_GET_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done



     public async GETTWEET_ID_CONSUME(): Promise<void> {

          await this.GET_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.GET_TWEET_ID(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async NAV_TWEET_CONSUME(): Promise<void> {

          await this.NAV_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.tweet.NAV_TWEET(JSON.parse(data.value || ""))
                    // console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.NAV_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

}


export { KafkaConsumer }