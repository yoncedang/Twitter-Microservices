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
  public app: Application;
  public port: string | number;
  private redis: RedisClass = new RedisClass();
  private kafka: KafkaConsumer = new KafkaConsumer();
  private elasticsearch: ElasticsearchService = new ElasticsearchService();
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
    this.app.use(cookieParser());
  }

  private appRoutes(): void {
    this.app.use('/', (req: Request, res: Response) => {
      res.send('Hello World! from API');
    })
  }
  private async connect(): Promise<void> {
    this.elasticsearch.connect();
    this.redis.connectRedis();
    Promise.all([
      this.kafka.LIKE_TWEET_CONSUME(),
      this.kafka.UNLIKE_TWEET_CONSUME(),
      this.kafka.COMMENT_TWEET_CONSUME(),
      this.kafka.GET_COMMENT_CONSUME(),
      this.kafka.DEL_COMMENT_CONSUME(),
      this.kafka.EDIT_COMMENT_CONSUME(),
      this.kafka.ALL_COMMENT_CONSUME(),
      this.kafka.DEL_INTERACT_CONSUME(),
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

new App()