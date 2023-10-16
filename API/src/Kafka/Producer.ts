

import { KafkaClient } from "./Kafka";
import { Producer } from "kafkajs";


class KafkaProducer extends KafkaClient {

     private producer: Producer;

     constructor() {
          super()
          this.producer = this.kafka.producer({ allowAutoTopicCreation: true })
          this.connect()
     }

     private async connect(): Promise<void> {
          await this.producer.connect()
     }

     public async sendMessage(topic: string, key: string, message: any): Promise<boolean | void> {
          try {
               await this.producer.send({
                    topic: topic,
                    messages: [{
                         key: key,
                         value: JSON.stringify(message)
                    }]
               })
          } catch (error: any) {
               console.log( "Error", error.message)
          }
     }
}

export {
     KafkaProducer
}