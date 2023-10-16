import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface followingAttributes {
  id: number;
  auth_id: number;
  following_id: number;
}

export type followingPk = "id";
export type followingId = following[followingPk];
export type followingOptionalAttributes = "id";
export type followingCreationAttributes = Optional<followingAttributes, followingOptionalAttributes>;

export class following extends Model<followingAttributes, followingCreationAttributes> implements followingAttributes {
  id!: number;
  auth_id!: number;
  following_id!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof following {
    return following.init({
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
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'following',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "following_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
