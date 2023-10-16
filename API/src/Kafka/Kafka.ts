import { Kafka, logLevel } from "kafkajs";
import ip from "ip";


class KafkaClient {

     public kafka: Kafka;
     private clientId: string = "API_SERVICE";

     constructor () {
          this.kafka = new Kafka({
               clientId: this.clientId,
               brokers: [`127.0.0.1:9092`],
          })
     }
}


export {
     KafkaClient
}


