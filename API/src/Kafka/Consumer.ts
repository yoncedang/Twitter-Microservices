import { Consumer } from "kafkajs";
import { KafkaClient } from "./Kafka";
import { CONSUMER } from "./TOPIC";
import { RedisClass } from "../Redis/Redis";


let ReceivedMessage: any = null;
class KafkaConsumer extends KafkaClient {

     private redis: RedisClass;
     private consumer: any = CONSUMER;
     private CONSUMER_FROM_AUTH: Consumer;
     private VERIFICATION_EMAIL: Consumer;
     private VERIFICATION_OTP: Consumer;
     private RESPONSE_REQUEST_VERIFICATION: Consumer;
     private RESPONSE_FORGOT_PASSWORD: Consumer;
     private RESPONSE_RESET_PASSWORD: Consumer;
     private RESPONSE_LOGIN: Consumer;
     private RESPONSE_CHANGE_PASSWORD: Consumer;
     private RESPONSE_UPDATE_PROFILE: Consumer;
     private RESPONSE_CHANGE_EMAIL: Consumer;
     private RESPONSE_VERIFY_CHANGE_EMAIL: Consumer;
     private RESPONSE_GET_USER: Consumer;
     private RESPONSE_DEL_USER: Consumer;
     private RESPONSE_SUSPENDED_USER: Consumer;
     private RESPONSE_UNSUSPENDED_USER: Consumer;
     private RESPONSE_ALL_USER: Consumer;
     private RESPONSE_LOGOUT: Consumer;
     private RESPONSE_SET_AVATAR: Consumer;
     private RESPONSE_USERNAME: Consumer;
     private RESPONSE_FOLLOW_TOPIC: Consumer;
     private RESPONSE_UNFOLLOW_TOPIC: Consumer;
     private RESPONSE_ALL_FOLLOW_TOPIC: Consumer;
     private RESPONSE_ALL_FOLLOWING_TOPIC: Consumer;
     private RESPONSE_TWEET_TOPIC: Consumer;
     private RESPONSE_DELETE_TWEET_TOPIC: Consumer;
     private RESPONSE_CHECK_TWEET: Consumer;
     private RESPONSE_RETWEET_TOPIC: Consumer;
     private REPONSE_UNRETWEET_TOPIC: Consumer;
     private REPONSE_LIKE_TOPIC: Consumer;
     private REPONSE_UNLIKE_TOPIC: Consumer;
     private REPONSE_COMMENT_TOPIC: Consumer;
     private RESPONSE_GET_COMMENT_TOPIC: Consumer;
     private RESPONSE_DEL_COMMENT_TOPIC: Consumer;
     private RESPONSE_EDIT_COMMENT_TOPIC: Consumer;
     private RESPONSE_ALL_COMMENT_TWEET_TOPIC: Consumer;
     private RESPONSE_GET_TWEET_ID: Consumer;
     private RESPONSE_NAV_PAGE: Consumer;
     constructor() {

          super();
          this.redis = new RedisClass();
          this.CONSUMER_FROM_AUTH = this.kafka.consumer({ groupId: "CONSUMER_FROM_AUTH_1", allowAutoTopicCreation: true });
          this.VERIFICATION_EMAIL = this.kafka.consumer({ groupId: "VERIFICATION_EMAIL_1", allowAutoTopicCreation: true });
          this.VERIFICATION_OTP = this.kafka.consumer({ groupId: "VERIFICATION_OTP_1", allowAutoTopicCreation: true });
          this.RESPONSE_REQUEST_VERIFICATION = this.kafka.consumer({ groupId: "RESPONSE_REQUEST_VERIFICATION_1", allowAutoTopicCreation: true });
          this.RESPONSE_FORGOT_PASSWORD = this.kafka.consumer({ groupId: "RESPONSE_FORGOT_PASSWORD_1", allowAutoTopicCreation: true });
          this.RESPONSE_RESET_PASSWORD = this.kafka.consumer({ groupId: "RESPONSE_RESET_PASSWORD_1", allowAutoTopicCreation: true });
          this.RESPONSE_LOGIN = this.kafka.consumer({ groupId: "RESPONSE_LOGIN_1", allowAutoTopicCreation: true });
          this.RESPONSE_CHANGE_PASSWORD = this.kafka.consumer({ groupId: "RESPONSE_CHANGE_PASSWORD_1", allowAutoTopicCreation: true });
          this.RESPONSE_UPDATE_PROFILE = this.kafka.consumer({ groupId: "RESPONSE_UPDATE_PROFILE_1", allowAutoTopicCreation: true });
          this.RESPONSE_CHANGE_EMAIL = this.kafka.consumer({ groupId: "RESPONSE_CHANGE_EMAIL_1", allowAutoTopicCreation: true });
          this.RESPONSE_VERIFY_CHANGE_EMAIL = this.kafka.consumer({ groupId: "RESPONSE_VERIFY_CHANGE_EMAIL_1", allowAutoTopicCreation: true });
          this.RESPONSE_GET_USER = this.kafka.consumer({ groupId: "RESPONSE_GET_USER_1", allowAutoTopicCreation: true });
          this.RESPONSE_DEL_USER = this.kafka.consumer({ groupId: "RESPONSE_DEL_USER_1", allowAutoTopicCreation: true });
          this.RESPONSE_SUSPENDED_USER = this.kafka.consumer({ groupId: "RESPONSE_SUSPENDED_USER_1", allowAutoTopicCreation: true });
          this.RESPONSE_UNSUSPENDED_USER = this.kafka.consumer({ groupId: "RESPONSE_UNSUSPENDED_USER_1", allowAutoTopicCreation: true });
          this.RESPONSE_ALL_USER = this.kafka.consumer({ groupId: "RESPONSE_ALL_USER_1", allowAutoTopicCreation: true });
          this.RESPONSE_LOGOUT = this.kafka.consumer({ groupId: "RESPONSE_LOGOUT_1", allowAutoTopicCreation: true });
          this.RESPONSE_SET_AVATAR = this.kafka.consumer({ groupId: "RESPONSE_SET_AVATAR_1", allowAutoTopicCreation: true });
          this.RESPONSE_USERNAME = this.kafka.consumer({ groupId: "RESPONSE_USERNAME_1", allowAutoTopicCreation: true });
          this.RESPONSE_FOLLOW_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_FOLLOW_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_UNFOLLOW_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_UNFOLLOW_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_ALL_FOLLOW_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_ALL_FOLLOW_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_ALL_FOLLOWING_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_ALL_FOLLOWING_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_TWEET_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_TWEET_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_DELETE_TWEET_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_DELETE_TWEET_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_CHECK_TWEET = this.kafka.consumer({ groupId: "RESPONSE_CHECK_TWEET_1", allowAutoTopicCreation: true });
          this.RESPONSE_RETWEET_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_RETWEET_TOPIC_1", allowAutoTopicCreation: true });
          this.REPONSE_UNRETWEET_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_UNRETWEET_TOPIC_1", allowAutoTopicCreation: true });
          this.REPONSE_LIKE_TOPIC = this.kafka.consumer({ groupId: "REPONSE_LIKE_TOPIC_1", allowAutoTopicCreation: true });
          this.REPONSE_UNLIKE_TOPIC = this.kafka.consumer({ groupId: "REPONSE_unLIKE_TOPIC_1", allowAutoTopicCreation: true });
          this.REPONSE_COMMENT_TOPIC = this.kafka.consumer({ groupId: "REPONSE_COMMENT_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_GET_COMMENT_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_GET_COMMENT_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_DEL_COMMENT_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_DEL_COMMENT_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_EDIT_COMMENT_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_EDIT_COMMENT_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_ALL_COMMENT_TWEET_TOPIC = this.kafka.consumer({ groupId: "RESPONSE_ALL_COMMENT_TWEET_TOPIC_1", allowAutoTopicCreation: true });
          this.RESPONSE_GET_TWEET_ID = this.kafka.consumer({ groupId: "RESPONSE_GET_TWEET_ID_1", allowAutoTopicCreation: true });
          this.RESPONSE_NAV_PAGE = this.kafka.consumer({ groupId: "RESPONSE_NAV_PAGE_1", allowAutoTopicCreation: true });
          this.connect();
          this.subscribe();
     }

     private async connect(): Promise<void> {
          await this.CONSUMER_FROM_AUTH.connect();
          await this.VERIFICATION_EMAIL.connect();
          await this.VERIFICATION_OTP.connect();
          await this.RESPONSE_REQUEST_VERIFICATION.connect();
          await this.RESPONSE_FORGOT_PASSWORD.connect();
          await this.RESPONSE_RESET_PASSWORD.connect();
          await this.RESPONSE_LOGIN.connect();
          await this.RESPONSE_CHANGE_PASSWORD.connect();
          await this.RESPONSE_UPDATE_PROFILE.connect();
          await this.RESPONSE_CHANGE_EMAIL.connect();
          await this.RESPONSE_VERIFY_CHANGE_EMAIL.connect();
          await this.RESPONSE_GET_USER.connect();
          await this.RESPONSE_DEL_USER.connect();
          await this.RESPONSE_SUSPENDED_USER.connect();
          await this.RESPONSE_UNSUSPENDED_USER.connect();
          await this.RESPONSE_ALL_USER.connect();
          await this.RESPONSE_LOGOUT.connect();
          await this.RESPONSE_SET_AVATAR.connect();
          await this.RESPONSE_USERNAME.connect();
          await this.RESPONSE_FOLLOW_TOPIC.connect();
          await this.RESPONSE_UNFOLLOW_TOPIC.connect();
          await this.RESPONSE_ALL_FOLLOW_TOPIC.connect();
          await this.RESPONSE_ALL_FOLLOWING_TOPIC.connect();
          await this.RESPONSE_TWEET_TOPIC.connect();
          await this.RESPONSE_DELETE_TWEET_TOPIC.connect();
          await this.RESPONSE_CHECK_TWEET.connect();
          await this.RESPONSE_RETWEET_TOPIC.connect();
          await this.REPONSE_UNRETWEET_TOPIC.connect();
          await this.REPONSE_LIKE_TOPIC.connect();
          await this.REPONSE_UNLIKE_TOPIC.connect();
          await this.REPONSE_COMMENT_TOPIC.connect();
          await this.RESPONSE_GET_COMMENT_TOPIC.connect();
          await this.RESPONSE_DEL_COMMENT_TOPIC.connect();
          await this.RESPONSE_EDIT_COMMENT_TOPIC.connect();
          await this.RESPONSE_ALL_COMMENT_TWEET_TOPIC.connect();
          await this.RESPONSE_GET_TWEET_ID.connect();
          await this.RESPONSE_NAV_PAGE.connect();
     }

     private async subscribe(): Promise<void> {
          Promise.all([
               this.CONSUMER_FROM_AUTH.subscribe({ topic: this.consumer.RESPONSE_FROM_AUTH_SERVICE }),
               this.VERIFICATION_EMAIL.subscribe({ topic: this.consumer.RESPONSE_VERIFICATION_EMAIL_FROM_AUTH }),
               this.VERIFICATION_OTP.subscribe({ topic: this.consumer.RESPONSE_VERIFICATION_OTP_FROM_API_TO_AUTH }),
               this.RESPONSE_REQUEST_VERIFICATION.subscribe({ topic: this.consumer.RESPONSE_REQUEST_VERIFICATION }),
               this.RESPONSE_FORGOT_PASSWORD.subscribe({ topic: this.consumer.RESPONSE_FORGOT_PASSWORD }),
               this.RESPONSE_RESET_PASSWORD.subscribe({ topic: this.consumer.RESPONSE_RESET_PASSWORD }),
               this.RESPONSE_LOGIN.subscribe({ topic: this.consumer.RESPONSE_LOGIN }),
               this.RESPONSE_CHANGE_PASSWORD.subscribe({ topic: this.consumer.RESPONSE_CHANGE_PASSWORD }),
               this.RESPONSE_UPDATE_PROFILE.subscribe({ topic: this.consumer.RESPONSE_UPDATE_PROFILE }),
               this.RESPONSE_CHANGE_EMAIL.subscribe({ topic: this.consumer.RESPONSE_CHANGE_EMAIL }),
               this.RESPONSE_VERIFY_CHANGE_EMAIL.subscribe({ topic: this.consumer.RESPONSE_VERIFY_CHANGE_EMAIL }),
               this.RESPONSE_GET_USER.subscribe({ topic: this.consumer.RESPONSE_GET_USER }),
               this.RESPONSE_DEL_USER.subscribe({ topic: this.consumer.RESPONSE_DEL_USER }),
               this.RESPONSE_SUSPENDED_USER.subscribe({ topic: this.consumer.RESPONSE_SUSPENDED_USER }),
               this.RESPONSE_UNSUSPENDED_USER.subscribe({ topic: this.consumer.RESPONSE_UNSUSPENDED_USER }),
               this.RESPONSE_ALL_USER.subscribe({ topic: this.consumer.RESPONSE_ALL_USER }),
               this.RESPONSE_LOGOUT.subscribe({ topic: this.consumer.RESPONSE_LOGOUT }),
               this.RESPONSE_SET_AVATAR.subscribe({ topic: this.consumer.RESPONSE_SET_AVATAR }),
               this.RESPONSE_USERNAME.subscribe({ topic: this.consumer.RESPONSE_USERNAME }),
               this.RESPONSE_FOLLOW_TOPIC.subscribe({ topic: this.consumer.RESPONSE_FOLLOW_TOPIC }),
               this.RESPONSE_UNFOLLOW_TOPIC.subscribe({ topic: this.consumer.RESPONSE_UNFOLLOW_TOPIC }),
               this.RESPONSE_ALL_FOLLOW_TOPIC.subscribe({ topic: this.consumer.RESPONSE_ALL_FOLLOW_TOPIC }),
               this.RESPONSE_ALL_FOLLOWING_TOPIC.subscribe({ topic: this.consumer.RESPONSE_ALL_FOLLOWING_TOPIC }),
               this.RESPONSE_TWEET_TOPIC.subscribe({ topic: this.consumer.RESPONSE_TWEET_TOPIC }),
               this.RESPONSE_DELETE_TWEET_TOPIC.subscribe({ topic: this.consumer.RESPONSE_DELETE_TWEET_TOPIC }),
               this.RESPONSE_CHECK_TWEET.subscribe({ topic: this.consumer.RESPONSE_CHECK_TWEET }),
               this.RESPONSE_RETWEET_TOPIC.subscribe({ topic: this.consumer.RESPONSE_RETWEET_TOPIC }),
               this.REPONSE_UNRETWEET_TOPIC.subscribe({ topic: this.consumer.REPONSE_UNRETWEET_TOPIC }),
               this.REPONSE_LIKE_TOPIC.subscribe({ topic: this.consumer.REPONSE_LIKE_TOPIC }),
               this.REPONSE_UNLIKE_TOPIC.subscribe({ topic: this.consumer.REPONSE_UNLIKE_TOPIC }),
               this.REPONSE_COMMENT_TOPIC.subscribe({ topic: this.consumer.REPONSE_COMMENT_TOPIC }),
               this.RESPONSE_GET_COMMENT_TOPIC.subscribe({ topic: this.consumer.RESPONSE_GET_COMMENT_TOPIC }),
               this.RESPONSE_DEL_COMMENT_TOPIC.subscribe({ topic: this.consumer.RESPONSE_DEL_COMMENT_TOPIC }),
               this.RESPONSE_EDIT_COMMENT_TOPIC.subscribe({ topic: this.consumer.RESPONSE_EDIT_COMMENT_TOPIC }),
               this.RESPONSE_ALL_COMMENT_TWEET_TOPIC.subscribe({ topic: this.consumer.RESPONSE_ALL_COMMENT_TWEET_TOPIC }),
               this.RESPONSE_GET_TWEET_ID.subscribe({ topic: this.consumer.RESPONSE_GET_TWEET_ID }),
               this.RESPONSE_NAV_PAGE.subscribe({ topic: this.consumer.RESPONSE_NAV_PAGE }),
          ])
     }

     public async SIGNUP_CONSUME(): Promise<void> {
          await this.CONSUMER_FROM_AUTH.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);

                         await this.CONSUMER_FROM_AUTH.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async VERIFY_EMAIL(): Promise<void> {
          await this.VERIFICATION_EMAIL.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.VERIFICATION_EMAIL.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     // Done

     public async VERIFY_OTP(): Promise<void> {
          await this.VERIFICATION_OTP.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.VERIFICATION_OTP.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async REQUEST_VERIFICATION(): Promise<void> {
          await this.RESPONSE_REQUEST_VERIFICATION.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_REQUEST_VERIFICATION.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async FORGOT_PASSWORD(): Promise<void> {
          await this.RESPONSE_FORGOT_PASSWORD.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_FORGOT_PASSWORD.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async RESET_PASSWORD(): Promise<void> {
          await this.RESPONSE_RESET_PASSWORD.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_RESET_PASSWORD.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async LOGIN_ACCOUNT(): Promise<void> {
          await this.RESPONSE_LOGIN.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_LOGIN.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async CHANGE_PASSWORD(): Promise<void> {
          await this.RESPONSE_CHANGE_PASSWORD.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("value", data.value)
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_CHANGE_PASSWORD.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async UPDATE_PROFILE(): Promise<void> {
          await this.RESPONSE_UPDATE_PROFILE.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("value", data.value)
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_UPDATE_PROFILE.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async CHANGE_EMAIL(): Promise<void> {
          await this.RESPONSE_CHANGE_EMAIL.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("value", data.value)
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_CHANGE_EMAIL.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async VERIFY_CHANGE_EMAIL(): Promise<void> {
          await this.RESPONSE_VERIFY_CHANGE_EMAIL.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("value", data.value)
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_VERIFY_CHANGE_EMAIL.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async GET_USER(): Promise<void> {
          await this.RESPONSE_GET_USER.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log("value", data.value)
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         console.log("value", data.value)
                         await this.RESPONSE_GET_USER.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async DEL_USER(): Promise<void> {
          await this.RESPONSE_DEL_USER.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_DEL_USER.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async SUSPENDED_USER(): Promise<void> {
          await this.RESPONSE_SUSPENDED_USER.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_SUSPENDED_USER.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async UNSUSPENDED_USER(): Promise<void> {
          await this.RESPONSE_UNSUSPENDED_USER.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_UNSUSPENDED_USER.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async GET_ALL_USER(): Promise<void> {
          await this.RESPONSE_ALL_USER.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_ALL_USER.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async LOGOUT(): Promise<void> {
          await this.RESPONSE_LOGOUT.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_LOGOUT.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async SET_AVATAR(): Promise<void> {
          await this.RESPONSE_SET_AVATAR.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_SET_AVATAR.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async USERNAME(): Promise<void> {
          await this.RESPONSE_USERNAME.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_USERNAME.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     
     // DONE AUTH SERVICE
     
     public async FOLLOW_USER(): Promise<void> {
          await this.RESPONSE_FOLLOW_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_FOLLOW_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async UNFOLLOW_USER(): Promise<void> {
          await this.RESPONSE_UNFOLLOW_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_UNFOLLOW_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async ALL_FOLLOW(): Promise<void> {
          await this.RESPONSE_ALL_FOLLOW_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_ALL_FOLLOW_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async ALL_FOLLOWING(): Promise<void> {
          await this.RESPONSE_ALL_FOLLOWING_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_ALL_FOLLOWING_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async CREATE_TWEET(): Promise<void> {
          await this.RESPONSE_TWEET_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_TWEET_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }
     
     public async DELETE_TWEET(): Promise<void> {
          await this.RESPONSE_DELETE_TWEET_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_DELETE_TWEET_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })

     }

     public async EDIT_TWEET(): Promise<void> {
          await this.RESPONSE_CHECK_TWEET.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_CHECK_TWEET.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async RE_TWEET(): Promise<void> {
          await this.RESPONSE_RETWEET_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_RETWEET_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async UN_RETWEET(): Promise<void> {
          await this.REPONSE_UNRETWEET_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.REPONSE_UNRETWEET_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async LIKE_TWEET(): Promise<void> {
          await this.REPONSE_LIKE_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.REPONSE_LIKE_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async UNLIKE_TWEET(): Promise<void> {
          await this.REPONSE_UNLIKE_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.REPONSE_UNLIKE_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async COMMENT_TWEET(): Promise<void> {
          await this.REPONSE_COMMENT_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.REPONSE_COMMENT_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async GET_COMMENT(): Promise<void> {
          await this.RESPONSE_GET_COMMENT_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_GET_COMMENT_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async DEL_COMMENT(): Promise<void> {
          await this.RESPONSE_DEL_COMMENT_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_DEL_COMMENT_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async EDIT_COMMENT(): Promise<void> {
          await this.RESPONSE_EDIT_COMMENT_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_EDIT_COMMENT_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async GET_ALL_COMMENT(): Promise<void> {
          await this.RESPONSE_ALL_COMMENT_TWEET_TOPIC.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_ALL_COMMENT_TWEET_TOPIC.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async GET_TWEET_ID(): Promise<void> {
          await this.RESPONSE_GET_TWEET_ID.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_GET_TWEET_ID.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }

     public async NAV_TWEET(): Promise<void> {
          await this.RESPONSE_NAV_PAGE.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    ReceivedMessage = JSON.parse(data.value || "") // return value to JSON
                    console.log("value", JSON.parse(data.value || ""))
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.RESPONSE_NAV_PAGE.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }
          })
     }



     public async GET_RECEIVED_MESSAGE(): Promise<any> {
          return new Promise((resolve) => {
               const checkData = async () => {
                    if (ReceivedMessage) {
                         console.log("Get success: ", ReceivedMessage);
                         resolve(ReceivedMessage);
                         ReceivedMessage = null;
                    } else {
                         console.log("Waiting for data...");
                         setTimeout(checkData, 10); // Đợi 10ms trước khi kiểm tra lại
                    }
               };
               checkData();
          })
     }
}

export {
     KafkaConsumer
}