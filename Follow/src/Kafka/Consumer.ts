import { Consumer } from "kafkajs";
import { KafkaClient } from "./Kafka";
import { CONSUMER } from "./TOPIC";
import { RedisClass } from "../Redis/Redis";
import { Follow_Controller } from "../Controller/Controller";


class KafkaConsumer extends KafkaClient {
     private followController: Follow_Controller = new Follow_Controller();
     private redis: RedisClass;
     private consumer: any = CONSUMER;
     private FOLLOW_USER_SERVICES_consumer: Consumer;
     private UNFOLLOW_USER_SERVICES_consumer: Consumer;
     private ALL_FOLLOW_USER_SERVICES_consumer: Consumer;
     private ALL_FOLLOWING_USER_SERVICES_consumer: Consumer;
     private CREATE_FOLLOW_TOPIC_consumer: Consumer;
     private DEL_ACCOUNT_TOPIC_consumer: Consumer;

     constructor() {
          super();
          this.redis = new RedisClass();
          this.FOLLOW_USER_SERVICES_consumer = this.kafka.consumer({ groupId: 'FOLLOW_USER_SERVICES_consumer', allowAutoTopicCreation: true });
          this.UNFOLLOW_USER_SERVICES_consumer = this.kafka.consumer({ groupId: 'UNFOLLOW_USER_SERVICES_consumer', allowAutoTopicCreation: true });
          this.ALL_FOLLOW_USER_SERVICES_consumer = this.kafka.consumer({ groupId: 'GET_ALL_FOLLOW_TOPIC_consumer', allowAutoTopicCreation: true });
          this.ALL_FOLLOWING_USER_SERVICES_consumer = this.kafka.consumer({ groupId: 'GET_ALL_FOLLOWING_TOPIC_consumer', allowAutoTopicCreation: true });
          this.CREATE_FOLLOW_TOPIC_consumer = this.kafka.consumer({ groupId: 'CREATE_FOLLOW_TOPIC_consumer', allowAutoTopicCreation: true });
          this.DEL_ACCOUNT_TOPIC_consumer = this.kafka.consumer({ groupId: 'DEL_ACCOUNT_TOPIC_consumer', allowAutoTopicCreation: true });
     }

     public async CREATE_FOLLOW_CONSUME(): Promise<void> {
          await this.CREATE_FOLLOW_TOPIC_consumer.connect();
          await this.CREATE_FOLLOW_TOPIC_consumer.subscribe({ topic: this.consumer.CREATE_FOLLOW_TOPIC })
          await this.CREATE_FOLLOW_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.countFollow(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CREATE_FOLLOW_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async DEL_ACCOUNT_CONSUME(): Promise<void> {
          await this.DEL_ACCOUNT_TOPIC_consumer.connect();
          await this.DEL_ACCOUNT_TOPIC_consumer.subscribe({ topic: this.consumer.DEL_ACCOUNT_TOPIC })
          await this.DEL_ACCOUNT_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.del_follow(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.DEL_ACCOUNT_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async FOLLOW_CONSUME(): Promise<void> {
          await this.FOLLOW_USER_SERVICES_consumer.connect();
          await this.FOLLOW_USER_SERVICES_consumer.subscribe({ topic: this.consumer.FOLLOW_USER_SERVICES })
          await this.FOLLOW_USER_SERVICES_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.followUser(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.FOLLOW_USER_SERVICES_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     // Done
     public async UNFOLLOW_CONSUME(): Promise<void> {
          await this.UNFOLLOW_USER_SERVICES_consumer.connect();
          await this.UNFOLLOW_USER_SERVICES_consumer.subscribe({ topic: this.consumer.UNFOLLOW_USER_SERVICES })
          await this.UNFOLLOW_USER_SERVICES_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.unfollowUser(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.UNFOLLOW_USER_SERVICES_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     // Done
     public async ALL_FOLLOW_CONSUME(): Promise<void> {
          await this.ALL_FOLLOW_USER_SERVICES_consumer.connect();
          await this.ALL_FOLLOW_USER_SERVICES_consumer.subscribe({ topic: this.consumer.ALL_FOLLOW_USER_SERVICES })
          await this.ALL_FOLLOW_USER_SERVICES_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.all_followuser(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.ALL_FOLLOW_USER_SERVICES_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async ALL_FOLLOWING_CONSUME(): Promise<void> {
          await this.ALL_FOLLOWING_USER_SERVICES_consumer.connect();
          await this.ALL_FOLLOWING_USER_SERVICES_consumer.subscribe({ topic: this.consumer.ALL_FOLLOWING_USER_SERVICES })
          await this.ALL_FOLLOWING_USER_SERVICES_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.followController.all_following(JSON.parse(data.value || ""))
                    console.log("Data", JSON.parse(data.value || ""))
                    // console.log("data", data)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.ALL_FOLLOWING_USER_SERVICES_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

}


export { KafkaConsumer }