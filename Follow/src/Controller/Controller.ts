import { SequelizeClient } from "../Model/Sequelize";
import { RedisClass } from "../Redis/Redis";
import { v4 as uuidv4 } from "uuid";
import { KafkaProducer } from "../Kafka/Producer";
import { follower } from "../Model/postgreSQL/follower";
import { following } from "../Model/postgreSQL/following";
import { count } from "../Model/postgreSQL/count";


const sequelize: SequelizeClient = new SequelizeClient();
const redis: RedisClass = new RedisClass();
const producer: KafkaProducer = new KafkaProducer();
const uuid = uuidv4();


class Follow_Controller {

     private async Response(topic: string, message: string, status: number) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status })
     }

     private async Response_With_Data(topic: string, status: number, message: any, data: any) {
          await redis.SET_REDIS(uuid, "Can't set value") // Set token verify on Redis
          await producer.sendMessage(topic, uuid, { message, status, data })
     }

     public async countFollow(data: any): Promise<boolean | void> {
          console.log("Count Follow Controller", data)
          const { auth_id } = data;
          console.log("auth_id", auth_id)

          await sequelize.model.count.create({
               auth_id: Number(auth_id),
               // count_follow: 0,
               // count_following: 0,
          })


     }

     public async followUser(data: any): Promise<boolean | void> {
          console.log("Follow Controller", data)
          const { message, status, auth_id, follow_user } = data;

          const existingFollow = await sequelize.model.following.findOne({
               where: {
                    auth_id, // Người theo dõi
                    following_id: follow_user, // Người được theo dõi
               },
               raw: true,
          });
          if (existingFollow) return await this.Response(message, "You have already followed this user", 422)
          if (auth_id === follow_user) return await this.Response(message, "You can't follow yourself", 400)
          const followUSER = await sequelize.model.following.create({
               auth_id,
               following_id: follow_user,
          })


          if (followUSER) {
               await sequelize.model.follower.create({
                    auth_id: follow_user,
                    follower_id: auth_id,
               })

          }

          await sequelize.model.count.increment("total_following", { by: 1, where: { auth_id } })
          await sequelize.model.count.increment("total_follower", { by: 1, where: { auth_id: follow_user } })
          return await this.Response(message, "Follow success", status)
     }

     public async unfollowUser(data: any): Promise<boolean | void> {
          console.log("unfollow Controller", data)
          const { message, status, auth_id, unfollow_user } = data;
          const existingFollow = await sequelize.model.following.findOne({
               where: {
                    auth_id, // Người theo dõi
                    following_id: unfollow_user, // Người được theo dõi
               },
               raw: true,
          });

          if (!existingFollow) return await this.Response(message, "You dont follow this user", 404)
          const unfollowUSER = await sequelize.model.following.destroy({
               where: {
                    auth_id,
                    following_id: unfollow_user,
               },
          })

          if (unfollowUSER) {
               await sequelize.model.follower.destroy({
                    where: {
                         auth_id: unfollow_user,
                         follower_id: auth_id,
                    },
               })
          }
          await sequelize.model.count.decrement("total_following", { by: 1, where: { auth_id } })
          await sequelize.model.count.decrement("total_follower", { by: 1, where: { auth_id: unfollow_user } })
          return await this.Response(message, "Unfollow success", status)
     }

     public async all_followuser(data: any): Promise<boolean | void> {
          // console.log("all follow Controller", data)
          const { auth_id, message, status } = data;

          const check_auth = await sequelize.model.follower.findOne({
               where: {
                    auth_id: Number(auth_id),
               }
          })
          if (!check_auth) return await this.Response(message, "This user don't have any follower", 404)

          const all_follow = await sequelize.model.follower.findAll({
               where: {
                    auth_id: Number(auth_id),
               },
               attributes: ["follower_id"],
               raw: true, /// Đỗ dữ liệu ra ...
          })
          if (all_follow) {
               return await this.Response_With_Data(message, status, "success", all_follow)

          }

     }


     public async all_following(data: any): Promise<boolean | void> {
          // console.log("all follow Controller", data)
          const { auth_id, message, status } = data;

          const check_auth = await sequelize.model.following.findOne({
               where: {
                    auth_id: Number(auth_id),
               }
          })
          if (!check_auth) return await this.Response(message, "This user don't following anyone", 404)

          const all_follow = await sequelize.model.following.findAll({
               where: {
                    auth_id: Number(auth_id),
               },
               // attributes: ["following_id"],
               raw: true, /// Đỗ dữ liệu ra ...
          })
          if (all_follow) {
               return await this.Response_With_Data(message, status, "success", all_follow)

          }
     }

     public async del_follow(data: any): Promise<boolean | void> {
          const { auth_id } = data;
          await sequelize.model.count.destroy({
               where: {
                    auth_id: Number(auth_id),
               }
          })
     }
}

export {
     Follow_Controller
}

// yarn sequelize-auto -h localhost -d follow -u root -x 181199 -p 5432  --dialect postgres -o src/Model/postgreSQL -l ts