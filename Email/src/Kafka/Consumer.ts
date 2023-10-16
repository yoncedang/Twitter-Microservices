import { KafkaClient } from "./Kafka";
import { RedisClass } from "../Redis/Redis";
import { COMSUMER_TOPIC } from "./TOPIC";
import { Consumer } from "kafkajs";
import classNodemailer from "../Mail/Nodemailer";





class KafkaConsumer extends KafkaClient {

     private nodemailer = new classNodemailer();
     private redis: RedisClass;
     private SIGNUP_consumer: Consumer;
     private Verification_From_API_To_Email_consumer: Consumer;
     private Forgot_Password: Consumer;
     private CHANGE_EMAIL: Consumer;
     private SUSPENDED_ACCOUNT: Consumer;
     private UNSUSPENDED_ACCOUNT: Consumer;
     private consumer: any = COMSUMER_TOPIC;

     constructor() {
          super();
          this.redis = new RedisClass();
          this.SIGNUP_consumer = this.kafka.consumer({ groupId: "EMAIL_SERVICE_1", allowAutoTopicCreation: true });
          this.Verification_From_API_To_Email_consumer = this.kafka.consumer({ groupId: "EMAIL_SERVICE_2", allowAutoTopicCreation: true });
          this.Forgot_Password = this.kafka.consumer({ groupId: "EMAIL_SERVICE_3", allowAutoTopicCreation: true });
          this.CHANGE_EMAIL = this.kafka.consumer({ groupId: "EMAIL_SERVICE_4", allowAutoTopicCreation: true });
          this.SUSPENDED_ACCOUNT = this.kafka.consumer({ groupId: "EMAIL_SERVICE_5", allowAutoTopicCreation: true });
          this.UNSUSPENDED_ACCOUNT = this.kafka.consumer({ groupId: "EMAIL_SERVICE_6", allowAutoTopicCreation: true });
          this.connect();
          this.subscribe();
     }

     private async connect(): Promise<void> {
          await this.SIGNUP_consumer.connect();
          await this.Verification_From_API_To_Email_consumer.connect();
          await this.Forgot_Password.connect();
          await this.CHANGE_EMAIL.connect();
          await this.SUSPENDED_ACCOUNT.connect();
     }

     private async subscribe(): Promise<void> {
          Promise.all([
               this.SIGNUP_consumer.subscribe({ topic: this.consumer.PRODUCER_SIGNUP_NODEMAILER }),
               this.Verification_From_API_To_Email_consumer.subscribe({ topic: this.consumer.PRODUCER_SIGNUP_NODEMAILER_REQUEST_VERIFICATION }),
               this.Forgot_Password.subscribe({ topic: this.consumer.FORGOT_PASSWORD_NODEMAILER }),
               this.CHANGE_EMAIL.subscribe({ topic: this.consumer.CHANGE_EMAIL_NODEMAILER }),
               this.SUSPENDED_ACCOUNT.subscribe({ topic: this.consumer.RESPONSE_SUSPENDED_USER_NODEMAILER }),
               this.UNSUSPENDED_ACCOUNT.subscribe({ topic: this.consumer.RESPONSE_UNSUSPENDED_USER_NODEMAILER })
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
                    console.log(data.value)
                    console.log(data.key)
                    const { email, otp, verification } = JSON.parse(data.value || "");
                    await this.redis.SET_REDIS(otp, email) // Set OTP on Redis
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.nodemailer.SendLinkVerification(email, verification, otp)
                         await this.SIGNUP_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }

     public async REQUEST_VERIFICATION_CONSUME(): Promise<void> {
          await this.Verification_From_API_To_Email_consumer.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    console.log(data.value)
                    console.log(data.key)
                    const { email, otp, verification } = JSON.parse(data.value || "");
                    await this.redis.SET_REDIS(otp, email) // Set OTP on Redis
                    if (check_KEY) {
                         console.log("Topic:", data.topic);
                         await this.nodemailer.RequestVerification(email, verification, otp)
                         await this.Verification_From_API_To_Email_consumer.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }

     public async FORGOT_PASSWORD_CONSUME(): Promise<void> {
          await this.Forgot_Password.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    const { email, verification } = JSON.parse(data.value || "");
                    if (check_KEY) {
                         console.log("KEY: ", data.key)
                         console.log("Topic:", data.topic);
                         await this.nodemailer.ForgotPassword(email, verification)
                         await this.Forgot_Password.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }

     public async CHANGE_EMAIL_CONSUME(): Promise<void> {
          await this.CHANGE_EMAIL.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    const { email, verification } = JSON.parse(data.value || "");
                    console.log( "DATA", data.value)
                    if (check_KEY) {
                         await this.nodemailer.ChangeEmail(email, verification)
                         await this.CHANGE_EMAIL.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }

     public async SUSPENDED_ACCOUNT_CONSUME(): Promise<void> {
          await this.SUSPENDED_ACCOUNT.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    const { email } = JSON.parse(data.value || "");
                    if (check_KEY) {
                         await this.nodemailer.NotificationSuspend(email)
                         await this.SUSPENDED_ACCOUNT.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }

     public async UNSUSPENDED_ACCOUNT_CONSUME(): Promise<void> {
          await this.UNSUSPENDED_ACCOUNT.run({
               eachMessage: async ({ topic, partition, message }) => {
                    const data = {
                         topic,
                         partition,
                         key: message.key?.toString(),
                         value: message.value?.toString(),
                    }
                    const check_KEY = await this.redis.GET_REDIS(data.key || "")
                    const { email } = JSON.parse(data.value || "");
                    if (check_KEY) {
                         await this.nodemailer.NotificationUnsuspend(email)
                         await this.UNSUSPENDED_ACCOUNT.commitOffsets([{ topic: data.topic, partition: data.partition, offset: message.offset }])
                         await this.redis.DEL_REDIS(data.key || "")
                    }
               }

          })
     }
}

export {
     KafkaConsumer
}