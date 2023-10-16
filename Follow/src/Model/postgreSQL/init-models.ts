import type { Sequelize } from "sequelize";
import { count as _count } from "./count";
import type { countAttributes, countCreationAttributes } from "./count";
import { follower as _follower } from "./follower";
import type { followerAttributes, followerCreationAttributes } from "./follower";
import { following as _following } from "./following";
import type { followingAttributes, followingCreationAttributes } from "./following";

export {
  _count as count,
  _follower as follower,
  _following as following,
};

export type {
  countAttributes,
  countCreationAttributes,
  followerAttributes,
  followerCreationAttributes,
  followingAttributes,
  followingCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const count = _count.initModel(sequelize);
  const follower = _follower.initModel(sequelize);
  const following = _following.initModel(sequelize);


  return {
    count: count,
    follower: follower,
    following: following,
  };
}
