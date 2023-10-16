import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface followerAttributes {
  id: number;
  auth_id: number;
  follower_id: number;
}

export type followerPk = "id";
export type followerId = follower[followerPk];
export type followerOptionalAttributes = "id";
export type followerCreationAttributes = Optional<followerAttributes, followerOptionalAttributes>;

export class follower extends Model<followerAttributes, followerCreationAttributes> implements followerAttributes {
  id!: number;
  auth_id!: number;
  follower_id!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof follower {
    return follower.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'follower',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "follower_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
