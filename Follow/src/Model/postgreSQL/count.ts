import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface countAttributes {
  count_id: number;
  auth_id: number;
  total_follower?: number;
  total_following?: number;
}

export type countPk = "count_id";
export type countId = count[countPk];
export type countOptionalAttributes = "count_id" | "total_follower" | "total_following";
export type countCreationAttributes = Optional<countAttributes, countOptionalAttributes>;

export class count extends Model<countAttributes, countCreationAttributes> implements countAttributes {
  count_id!: number;
  auth_id!: number;
  total_follower?: number;
  total_following?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof count {
    return count.init({
    count_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_follower: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_following: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'count',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "count_pkey",
        unique: true,
        fields: [
          { name: "count_id" },
        ]
      },
    ]
  });
  }
}
