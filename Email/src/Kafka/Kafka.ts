import { Kafka } from "kafkajs";
import ip from "ip";
import { IP_ADDRESS } from "../Config/Config";


class KafkaClient {

     public kafka: Kafka;
     private clientId: string = "EMAIL_SERVICE";

     constructor() {
          this.kafka = new Kafka({
               clientId: this.clientId,
               brokers: [`${IP_ADDRESS}:9092`],
          })
     }
}

export {
     KafkaClient
}