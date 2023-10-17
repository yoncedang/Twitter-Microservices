import { Kafka } from "kafkajs";
import ip from "ip";
import { HOST_ADRESS } from "../Config/Config";


class KafkaClient {

     public kafka: Kafka;
     private clientId: string = "AUTH_SERVICE";

     constructor() {
          this.kafka = new Kafka({
               clientId: this.clientId,
               brokers: [`${HOST_ADRESS}:9092`],
          })
     }
}

export {
     KafkaClient
}