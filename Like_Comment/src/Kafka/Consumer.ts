import { Consumer } from "kafkajs";
import { KafkaClient } from "./Kafka";
import { CONSUMER } from "./TOPIC";
import { RedisClass } from "../Redis/Redis";
import { Like_Comment_Controller } from "../Controller/Controller";


class KafkaConsumer extends KafkaClient {
     private controller: Like_Comment_Controller = new Like_Comment_Controller();
     private redis: RedisClass;
     private consumer: any = CONSUMER;
     private LIKE_TWEET_consumer: Consumer
     private unLIKE_TWEET_TOPIC_consumer: Consumer
     private COMMENT_TWEET_TOPIC_consumer: Consumer
     private GET_COMMENT_TOPIC_consumer: Consumer
     private DEL_COMMENT_TOPIC_consumer: Consumer
     private EDIT_COMMENT_TOPIC_consumer: Consumer
     private GET_ALL_COMMENT_TOPIC_consumer: Consumer
     private DEL_INTERACT_consumer: Consumer
     constructor() {
          super();
          this.redis = new RedisClass();
          this.LIKE_TWEET_consumer = this.kafka.consumer({ groupId: 'LIKE_TWEET', allowAutoTopicCreation: true });
          this.unLIKE_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'unLIKE_TWEET_TOPIC', allowAutoTopicCreation: true });
          this.COMMENT_TWEET_TOPIC_consumer = this.kafka.consumer({ groupId: 'COMMENT_TWEET_TOPIC', allowAutoTopicCreation: true });
          this.GET_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: 'GET_COMMENT_TOPIC', allowAutoTopicCreation: true });
          this.DEL_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: 'DEL_COMMENT_TOPIC', allowAutoTopicCreation: true });
          this.EDIT_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: 'EDIT_COMMENT_TOPIC', allowAutoTopicCreation: true });
          this.GET_ALL_COMMENT_TOPIC_consumer = this.kafka.consumer({ groupId: 'GET_ALL_COMMENT_TOPIC', allowAutoTopicCreation: true });
          this.DEL_INTERACT_consumer = this.kafka.consumer({ groupId: 'DEL_INTERACT', allowAutoTopicCreation: true });
          this.connect();
          this.subscribe();
     }

     private async connect() {
          await this.LIKE_TWEET_consumer.connect();
          await this.unLIKE_TWEET_TOPIC_consumer.connect();
          await this.COMMENT_TWEET_TOPIC_consumer.connect();
          await this.GET_COMMENT_TOPIC_consumer.connect();
          await this.DEL_COMMENT_TOPIC_consumer.connect();
          await this.EDIT_COMMENT_TOPIC_consumer.connect();
          await this.GET_ALL_COMMENT_TOPIC_consumer.connect();
          await this.DEL_INTERACT_consumer.connect();
     }

     private async subscribe() {
          Promise.all([
               this.LIKE_TWEET_consumer.subscribe({ topic: this.consumer.TWEET_OK }),
               this.unLIKE_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.unLIKE_TWEET_TOPIC }),
               this.COMMENT_TWEET_TOPIC_consumer.subscribe({ topic: this.consumer.COMMENT_TWEET_TOPIC }),
               this.GET_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.GET_COMMENT_TOPIC }),
               this.DEL_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.DEL_COMMENT_TOPIC }),
               this.EDIT_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.EDIT_COMMENT_TOPIC }),
               this.GET_ALL_COMMENT_TOPIC_consumer.subscribe({ topic: this.consumer.GET_ALL_COMMENT_TOPIC }),
               this.DEL_INTERACT_consumer.subscribe({ topic: this.consumer.DEL_INTERACT }),
          ])
     }

     public async DEL_INTERACT_CONSUME(): Promise<void> {
          await this.DEL_INTERACT_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.DEL_INTERACT(JSON.parse(data.value || ""))
                    console.log("KEY: ", check_KEY)

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         console.log("OK DEL_INTERACT_CONSUME")
                         await this.DEL_INTERACT_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async LIKE_TWEET_CONSUME(): Promise<void> {
          await this.LIKE_TWEET_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.LIKE_TWEET(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.LIKE_TWEET_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async UNLIKE_TWEET_CONSUME(): Promise<void> {
          await this.unLIKE_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.unLIKE_TWEET(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.unLIKE_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async COMMENT_TWEET_CONSUME(): Promise<void> {
          await this.COMMENT_TWEET_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.COMMENT_TWEET(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.COMMENT_TWEET_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async GET_COMMENT_CONSUME(): Promise<void> {
          await this.GET_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.GET_COMMENT(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async DEL_COMMENT_CONSUME(): Promise<void> {
          await this.DEL_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.DEL_COMMENT(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.DEL_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async EDIT_COMMENT_CONSUME(): Promise<void> {
          await this.EDIT_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.EDIT_COMMENT(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.EDIT_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async ALL_COMMENT_CONSUME(): Promise<void> {
          await this.GET_ALL_COMMENT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY: string | number = await this.redis.GET_REDIS(data.key || "")
                    this.controller.ALL_COMMENT_TWEET(JSON.parse(data.value || ""))

                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_ALL_COMMENT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

}


export { KafkaConsumer }