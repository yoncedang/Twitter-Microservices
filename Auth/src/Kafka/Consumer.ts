import { Consumer } from "kafkajs";
import { KafkaClient } from "./Kafka";
import { CONSUMER } from "./TOPIC";
import { RedisClass } from "../Redis/Redis";
import { Auth_Controller } from "../Controller/Auth_Controller";



class KafkaConsumer extends KafkaClient {
     private redis: RedisClass;
     private consumer: any = CONSUMER;
     private authController: Auth_Controller;
     private SIGNUP_consumer: Consumer;
     private VERIFICATION_FROM_API_TO_AUTH_consumer: Consumer;
     private VERIFICATION_OTP_FROM_API_TO_AUTH_consumer: Consumer;
     private REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer: Consumer;
     private FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer: Consumer;
     private RESET_PASSWORD_FROM_API_TO_AUTH_consumer: Consumer;
     private LOGIN_FROM_API_TO_AUTH_consumer: Consumer;
     private CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer: Consumer;
     private UPDATE_PROFILE_FROM_API_TO_AUTH_consumer: Consumer
     private CHANGE_EMAIL_FROM_API_TO_AUTH_consumer: Consumer;
     private VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer: Consumer;
     private GET_USER_FROM_API_TO_AUTH_consumer: Consumer;
     private DEL_USER_FROM_API_TO_AUTH_consumer: Consumer;
     private SUSPENDED_USER_FROM_API_TO_AUTH_consumer: Consumer;
     private UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer: Consumer;
     private ALL_USER_FROM_API_TO_AUTH_consumer: Consumer;
     private LOGOUT_FROM_API_TO_AUTH_consumer: Consumer;
     private SET_AVATAR_FROM_API_TO_AUTH_consumer: Consumer;
     private USERNAME_FROM_API_TO_AUTH_consumer: Consumer;
     private FOLLOW_TOPIC_consumer: Consumer;
     private UNFOLLOW_TOPIC_consumer: Consumer;
     private GET_ALL_FOLLOW_TOPIC_consumer: Consumer;
     private GET_ALL_FOLLOWING_TOPIC_consumer: Consumer;
     constructor() {
          super();
          this.redis = new RedisClass();
          this.SIGNUP_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_1", allowAutoTopicCreation: true });
          this.VERIFICATION_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_2", allowAutoTopicCreation: true });
          this.VERIFICATION_OTP_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_3", allowAutoTopicCreation: true });
          this.REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_4", allowAutoTopicCreation: true });
          this.FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_5", allowAutoTopicCreation: true });
          this.RESET_PASSWORD_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_6", allowAutoTopicCreation: true });
          this.LOGIN_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_7", allowAutoTopicCreation: true });
          this.CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_9", allowAutoTopicCreation: true });
          this.UPDATE_PROFILE_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_10", allowAutoTopicCreation: true });
          this.CHANGE_EMAIL_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_11", allowAutoTopicCreation: true });
          this.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_12", allowAutoTopicCreation: true });
          this.GET_USER_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_13", allowAutoTopicCreation: true });
          this.DEL_USER_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_14", allowAutoTopicCreation: true });
          this.SUSPENDED_USER_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_15", allowAutoTopicCreation: true });
          this.UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_16", allowAutoTopicCreation: true });
          this.ALL_USER_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_17", allowAutoTopicCreation: true });
          this.LOGOUT_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_18", allowAutoTopicCreation: true });
          this.SET_AVATAR_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_19", allowAutoTopicCreation: true });
          this.USERNAME_FROM_API_TO_AUTH_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_20", allowAutoTopicCreation: true });
          this.FOLLOW_TOPIC_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_21", allowAutoTopicCreation: true });
          this.UNFOLLOW_TOPIC_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_22", allowAutoTopicCreation: true });
          this.GET_ALL_FOLLOW_TOPIC_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_23", allowAutoTopicCreation: true });
          this.GET_ALL_FOLLOWING_TOPIC_consumer = this.kafka.consumer({ groupId: "AUTH_SERVICE_24", allowAutoTopicCreation: true });
          this.authController = new Auth_Controller();
          this.connect();
          this.subscribe();
     }

     private async connect(): Promise<void> {
          await this.SIGNUP_consumer.connect();
          await this.VERIFICATION_FROM_API_TO_AUTH_consumer.connect();
          await this.VERIFICATION_OTP_FROM_API_TO_AUTH_consumer.connect();
          await this.REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer.connect();
          await this.FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer.connect();
          await this.RESET_PASSWORD_FROM_API_TO_AUTH_consumer.connect();
          await this.LOGIN_FROM_API_TO_AUTH_consumer.connect();
          await this.CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer.connect();
          await this.UPDATE_PROFILE_FROM_API_TO_AUTH_consumer.connect();
          await this.CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.connect();
          await this.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.connect();
          await this.GET_USER_FROM_API_TO_AUTH_consumer.connect();
          await this.DEL_USER_FROM_API_TO_AUTH_consumer.connect();
          await this.SUSPENDED_USER_FROM_API_TO_AUTH_consumer.connect();
          await this.UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer.connect();
          await this.ALL_USER_FROM_API_TO_AUTH_consumer.connect();
          await this.LOGOUT_FROM_API_TO_AUTH_consumer.connect();
          await this.SET_AVATAR_FROM_API_TO_AUTH_consumer.connect();
          await this.USERNAME_FROM_API_TO_AUTH_consumer.connect();
          await this.FOLLOW_TOPIC_consumer.connect();
          await this.UNFOLLOW_TOPIC_consumer.connect();
          await this.GET_ALL_FOLLOW_TOPIC_consumer.connect();
          await this.GET_ALL_FOLLOWING_TOPIC_consumer.connect();

     }

     private async subscribe(): Promise<void> {
          Promise.all([
               this.SIGNUP_consumer.subscribe({ topic: this.consumer.CONSUMER_SIGNUP }),
               this.VERIFICATION_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.VERIFICATION_FROM_API_TO_AUTH }),
               this.VERIFICATION_OTP_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.VERIFICATION_OTP_FROM_API_TO_AUTH }),
               this.REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.REQUEST_VERIFICATION_FROM_API_TO_AUTH }),
               this.FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.FORGOT_PASSWORD_FROM_API_TO_AUTH }),
               this.RESET_PASSWORD_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.RESET_PASSWORD_FROM_API_TO_AUTH }),
               this.LOGIN_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.LOGIN_FROM_API_TO_AUTH }),
               this.CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.CHANGE_PASSWORD_FROM_API_TO_AUTH }),
               this.UPDATE_PROFILE_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.UPDATE_PROFILE_FROM_API_TO_AUTH }),
               this.CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.CHANGE_EMAIL_FROM_API_TO_AUTH }),
               this.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH }),
               this.GET_USER_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.GET_USER_FROM_API_TO_AUTH }),
               this.DEL_USER_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.DEL_USER_FROM_API_TO_AUTH }),
               this.SUSPENDED_USER_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.SUSPENDED_USER_FROM_API_TO_AUTH }),
               this.UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.UNSUSPENDED_USER_FROM_API_TO_AUTH }),
               this.ALL_USER_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.ALL_USER_FROM_API_TO_AUTH }),
               this.LOGOUT_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.LOGOUT_FROM_API_TO_AUTH }),
               this.SET_AVATAR_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.SET_AVATAR_FROM_API_TO_AUTH }),
               this.USERNAME_FROM_API_TO_AUTH_consumer.subscribe({ topic: this.consumer.USERNAME_FROM_API_TO_AUTH }),
               this.FOLLOW_TOPIC_consumer.subscribe({ topic: this.consumer.FOLLOW_TOPIC }),
               this.UNFOLLOW_TOPIC_consumer.subscribe({ topic: this.consumer.UNFOLLOW_TOPIC }),
               this.GET_ALL_FOLLOW_TOPIC_consumer.subscribe({ topic: this.consumer.GET_ALL_FOLLOW_TOPIC }),
               this.GET_ALL_FOLLOWING_TOPIC_consumer.subscribe({ topic: this.consumer.GET_ALL_FOLLOWING_TOPIC }),
          ])
     }

     public async SIGNUP_CONSUME(): Promise<void> {
          await this.SIGNUP_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("Value: ",  data.value)
                    this.authController.SIGNUP(JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.SIGNUP_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async VERIFICATION_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.VERIFICATION_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.VERIFICATION_EMAIL(JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.VERIFICATION_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async VERIFICATION_OTP_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.VERIFICATION_OTP_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.VERIFICATION_OTP(JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.VERIFICATION_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async REQUEST_VERIFICATION_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.REQUEST_VERIFICATION(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.REQUEST_VERIFICATION_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async FORGOT_PASSWORD_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.FORGOT_PASSWORD(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.FORGOT_PASSWORD_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async RESET_PASSWORD_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.RESET_PASSWORD_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.RESET_PASSWORD(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESET_PASSWORD_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async LOGIN_FROM_API_TO_AUTH_CONSUME(): Promise<void> {
          await this.LOGIN_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.LOGIN(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.LOGIN_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async CHANGE_PASSWORD_CONSUME(): Promise<void> {
          await this.CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.CHANGE_PASSWORD(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHANGE_PASSWORD_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async UPDATE_PROFILE_CONSUME(): Promise<void> {
          await this.UPDATE_PROFILE_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.UPDATE_PROFILE(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.UPDATE_PROFILE_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done
     
     public async CHANGE_EMAIL_CONSUME(): Promise<void> {
          await this.CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.CHANGE_EMAIL(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async VERIFY_CHANGE_EMAIL_CONSUME(): Promise<void> {
          await this.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.VERIFY_CHANGE_EMAIL(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.VERIFY_CHANGE_EMAIL_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async GET_USER_CONSUME(): Promise<void> {
          await this.GET_USER_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.GET_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_USER_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async DEL_USER_CONSUME(): Promise<void> {
          await this.DEL_USER_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.DEL_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.DEL_USER_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done
     
     public async SUSPEND_USER_CONSUME(): Promise<void> {
          await this.SUSPENDED_USER_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.SUSPEND_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.SUSPENDED_USER_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async UNSUSPEND_USER_CONSUME(): Promise<void> {
          await this.UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.UNSUSPEND_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.UNSUSPENDED_USER_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async ALL_USER_CONSUME(): Promise<void> {
          await this.ALL_USER_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.ALL_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.ALL_USER_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async LOGOUT_CONSUME(): Promise<void> {
          await this.LOGOUT_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.LOGOUT(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.LOGOUT_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async SET_AVATAR_CONSUME(): Promise<void> {
          await this.SET_AVATAR_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.SET_AVATAR(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.SET_AVATAR_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done


     public async USERNAME_CONSUME(): Promise<void> {
          await this.USERNAME_FROM_API_TO_AUTH_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.GET_USERNAME(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.USERNAME_FROM_API_TO_AUTH_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done




     ///////////////////////////// FOLLOW TOPIC /////////////////////////////


     public async FOLLOW_CONSUME(): Promise<void> {
          await this.FOLLOW_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.FOLLOW_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.FOLLOW_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async UNFOLLOW_CONSUME(): Promise<void> {
          await this.UNFOLLOW_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.UNFOLLOW_USER(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)  
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.UNFOLLOW_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async ALL_FOLLOW_CONSUME(): Promise<void> {
          await this.GET_ALL_FOLLOW_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.ALL_FOLLOW(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)  
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_ALL_FOLLOW_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async ALL_FOLLOWING_CONSUME(): Promise<void> {
          await this.GET_ALL_FOLLOWING_TOPIC_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    this.authController.ALL_FOLLOWING(JSON.parse(data.value || ""))
                    // console.log("Value: ",  data.value)  
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.GET_ALL_FOLLOWING_TOPIC_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done






}

export {
     KafkaConsumer
}