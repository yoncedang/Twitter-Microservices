import express, { Application, Request, Response } from 'express';
import cors from "cors"
import { API_PORT } from './Config/Config';
import compression from 'compression';
import cookieParser from "cookie-parser"
// import { SequelizeClient } from './Sequelize/Sequelize'
import { RedisClass } from './Redis/Redis';
import { KafkaConsumer } from './Kafka/Consumer';
import { ElasticsearchService } from './ElasticSearch/Elasticsearch';
class App {
  private redis: RedisClass;
  public app: Application;
  public port: string | number;
  private kafkaConsumer: KafkaConsumer;
  private elasticsearch: ElasticsearchService;
  constructor() {
    this.app = express();
    this.port = API_PORT;
    this.redis = new RedisClass();
    this.kafkaConsumer = new KafkaConsumer();
    this.elasticsearch = new ElasticsearchService();
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
    this.app.use(cookieParser());
  }

  private appRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send("Hello World! This is Auth Service")
    })
  }
  private async connect(): Promise<void> {
    this.elasticsearch.connect();
    this.redis.connect();
    Promise.all([
      this.kafkaConsumer.SIGNUP_CONSUME(),
      this.kafkaConsumer.VERIFICATION_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.VERIFICATION_OTP_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.REQUEST_VERIFICATION_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.FORGOT_PASSWORD_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.RESET_PASSWORD_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.LOGIN_FROM_API_TO_AUTH_CONSUME(),
      this.kafkaConsumer.CHANGE_PASSWORD_CONSUME(),
      this.kafkaConsumer.UPDATE_PROFILE_CONSUME(),
      this.kafkaConsumer.CHANGE_EMAIL_CONSUME(),
      this.kafkaConsumer.VERIFY_CHANGE_EMAIL_CONSUME(),
      this.kafkaConsumer.GET_USER_CONSUME(),
      this.kafkaConsumer.DEL_USER_CONSUME(),
      this.kafkaConsumer.SUSPEND_USER_CONSUME(),
      this.kafkaConsumer.UNSUSPEND_USER_CONSUME(),
      this.kafkaConsumer.ALL_USER_CONSUME(),
      this.kafkaConsumer.LOGOUT_CONSUME(),
      this.kafkaConsumer.SET_AVATAR_CONSUME(),
      this.kafkaConsumer.USERNAME_CONSUME(),
      this.kafkaConsumer.FOLLOW_CONSUME(),
      this.kafkaConsumer.UNFOLLOW_CONSUME(),
      this.kafkaConsumer.ALL_FOLLOW_CONSUME(),
      this.kafkaConsumer.ALL_FOLLOWING_CONSUME(),
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

new App()