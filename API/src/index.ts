import express, { Application, Request, Response } from 'express';
import cors from "cors"
import { API_PORT } from './Config/Config';
import compression from 'compression';
import cookieParser from "cookie-parser"
import { ElasticsearchService } from './ElasticSearch/Elasticsearch';
import { RedisClass } from './Redis/Redis';
import { Routes } from './Routes/Routes';
import { KafkaConsumer } from './Kafka/Consumer';
import { Follow_Routes } from './Routes/Follow';
import { Tweet_Routes } from './Routes/Tweet';
import { Like_Comment_Routes } from './Routes/Like_Comment';
import YAML from "yaml"
import path from 'path';
import swaggerUI from "swagger-ui-express"
import fs from "fs"


class App {
  private es: ElasticsearchService;
  public app: Application;
  public port: string | number;
  private routes: Routes;
  private redis: RedisClass;
  private consumer: KafkaConsumer;
  private follow: Follow_Routes;
  private tweet: Tweet_Routes;
  private like_comment: Like_Comment_Routes;
  private file: any = fs.readFileSync(path.resolve("swagger.yaml"), "utf-8")
  private swaggerDocument: any = YAML.parse(this.file)
  constructor() {
    this.app = express();
    this.port = API_PORT;
    this.routes = new Routes();
    this.follow = new Follow_Routes();
    this.redis = new RedisClass();
    this.consumer = new KafkaConsumer();
    this.tweet = new Tweet_Routes();
    this.like_comment = new Like_Comment_Routes();
    this.es = new ElasticsearchService();
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
    this.app.use("/api", this.routes.router)
    this.app.use("/api/follow", this.follow.router)
    this.app.use("/api/tweet", this.tweet.router)
    this.app.use("/api/interact", this.like_comment.router)

    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.swaggerDocument));
  }
  private async connect(): Promise<void> {
    this.es.connect();
    this.redis.connect();
    Promise.all([
      this.consumer.SIGNUP_CONSUME(),
      this.consumer.VERIFY_EMAIL(),
      this.consumer.VERIFY_OTP(),
      this.consumer.REQUEST_VERIFICATION(),
      this.consumer.FORGOT_PASSWORD(),
      this.consumer.RESET_PASSWORD(),
      this.consumer.LOGIN_ACCOUNT(),
      this.consumer.CHANGE_PASSWORD(),
      this.consumer.UPDATE_PROFILE(),
      this.consumer.CHANGE_EMAIL(),
      this.consumer.VERIFY_CHANGE_EMAIL(),
      this.consumer.GET_USER(),
      this.consumer.DEL_USER(),
      this.consumer.SUSPENDED_USER(),
      this.consumer.UNSUSPENDED_USER(),
      this.consumer.GET_ALL_USER(),
      this.consumer.LOGOUT(),
      this.consumer.SET_AVATAR(),
      this.consumer.USERNAME(),
      /////////
      this.consumer.FOLLOW_USER(),
      this.consumer.UNFOLLOW_USER(),
      this.consumer.ALL_FOLLOW(),
      this.consumer.ALL_FOLLOWING(),
      /////////
      this.consumer.CREATE_TWEET(),
      this.consumer.DELETE_TWEET(),
      this.consumer.EDIT_TWEET(),
      this.consumer.RE_TWEET(),
      this.consumer.UN_RETWEET(),
      // this.consumer.RESPONSE_EDIT_TWEET(),

      /////////
      this.consumer.LIKE_TWEET(),
      this.consumer.UNLIKE_TWEET(),
      this.consumer.COMMENT_TWEET(),
      this.consumer.GET_COMMENT(),
      this.consumer.DEL_COMMENT(),
      this.consumer.EDIT_COMMENT(),
      this.consumer.GET_ALL_COMMENT(),
      this.consumer.GET_TWEET_ID(),
      this.consumer.NAV_TWEET(),
    ])
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

new App()