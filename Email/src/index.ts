import express, { Application, Request, Response } from 'express';
import cors from "cors"
import { API_PORT } from './Config/Config';
// import { SequelizeClient } from './Sequelize/Sequelize'
import { RedisClass } from './Redis/Redis';
import { KafkaConsumer } from './Kafka/Consumer';
import { IP_ADDRESS } from './Config/Config';
class App {
  public app: Application;
  public port: string | number;
  private kafkaConsumer: KafkaConsumer;
  constructor() {
    this.app = express();
    this.port = API_PORT;
    this.kafkaConsumer = new KafkaConsumer();
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
  }

  private appRoutes(): void {
    this.app.use('/', (req: Request, res: Response) => {
      res.send('Hello World! This is Email Service');
    })
  }
  private async connect(): Promise<void> {
    Promise.all([
      this.kafkaConsumer.SIGNUP_CONSUME(),
      this.kafkaConsumer.REQUEST_VERIFICATION_CONSUME(),
      this.kafkaConsumer.FORGOT_PASSWORD_CONSUME(),
      this.kafkaConsumer.CHANGE_EMAIL_CONSUME(),
      this.kafkaConsumer.SUSPENDED_ACCOUNT_CONSUME(),
      this.kafkaConsumer.UNSUSPENDED_ACCOUNT_CONSUME()
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://${IP_ADDRESS}:${this.port}`);
    });
  }
}

new App()