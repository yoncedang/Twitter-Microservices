import express, { Application, Request, Response } from 'express';
import cors from "cors"
import { API_PORT } from './Config/Config';
import compression from 'compression';
// import { SequelizeClient } from './Sequelize/Sequelize'
import { RedisClass } from './Redis/Redis';
import { KafkaConsumer } from './Kafka/Consumer';
import { ElasticsearchService } from './ElasticSearch/Elasticsearch';
class App {
  public app: Application;
  public port: string | number;
  private redis: RedisClass = new RedisClass();
  private kafka: KafkaConsumer = new KafkaConsumer();
  private es: ElasticsearchService = new ElasticsearchService();
  constructor() {
    this.app = express();
    this.port = API_PORT;
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
    this.es.connect();
    this.redis.connectRedis();
    Promise.all([
      // this.kafka.ALL_FOLLOWING_CONSUME(),
      this.kafka.CREATE_TWEET_CONSUME(),
      this.kafka.DELETE_TWEET_CONSUME(),
      this.kafka.CHECK_TWEET_CONSUME(),
      this.kafka.EDIT_TWEET_CONSUME(),
      this.kafka.RE_TWEET_CONSUME(),
      this.kafka.UNRETWEET_CONSUME(),
      this.kafka.CHECKTWEET_CONSUME(),
      this.kafka.GETTWEET_ID_CONSUME(),
      this.kafka.NAV_TWEET_CONSUME(),
      this.kafka.CHECK_FOR_COMMENT_CONSUME(),
      this.kafka.CHECK_TWEET_GET_COMMENT_CONSUME(),
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

new App()