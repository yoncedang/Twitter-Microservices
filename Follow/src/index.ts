import express, { Application, Request, Response } from 'express';
import cors from "cors"
import { API_PORT } from './Config/Config';
import compression from 'compression';
// import { SequelizeClient } from './Sequelize/Sequelize'
import { SequelizeClient } from './Model/Sequelize';
import { RedisClass } from './Redis/Redis';
import { KafkaConsumer } from './Kafka/Consumer';
import { HOST_ADRESS } from './Config/Config';
class App {
  public app: Application;
  public port: string | number;
  private kafka: KafkaConsumer;
  private redis: RedisClass;
  constructor() {
    this.app = express();
    this.port = API_PORT;
    this.kafka = new KafkaConsumer();
    this.redis = new RedisClass();
    this.Middlewares();
    this.appRoutes();
    this.listen();
    this.connect();
  }

  private Middlewares(): void {
    this.app.use(express.static('.'));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(compression());
  }

  private appRoutes(): void {
    this.app.use('/', (req: Request, res: Response) => {
      res.send('Hello World! from API');
    })
  }
  private async connect(): Promise<void> {

    this.redis.connect();
    Promise.all([
      this.kafka.DEL_ACCOUNT_CONSUME(),
      this.kafka.CREATE_FOLLOW_CONSUME(),
      this.kafka.FOLLOW_CONSUME(),
      this.kafka.UNFOLLOW_CONSUME(),
      this.kafka.ALL_FOLLOW_CONSUME(),
      this.kafka.ALL_FOLLOWING_CONSUME(),
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://${HOST_ADRESS}:${this.port}`);
    });
  }
}

new App()