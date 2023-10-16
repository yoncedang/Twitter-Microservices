import { Kafka } from "kafkajs";
import ip from "ip";



class KafkaClient {

     public kafka: Kafka;
     private clientId: string = "AUTH_SERVICE";

     constructor() {
          this.kafka = new Kafka({
               clientId: this.clientId,
               brokers: [`${ip.address()}:9092`],
          })
     }
}

export {
     KafkaClient
}