import { Sequelize } from 'sequelize';
import { SequelizeAuto } from '../Config/Config';
import { initModels } from './postgreSQL/init-models';

class SequelizeClient {
     private sequelize: Sequelize;
     private SequelizeAuto: any = SequelizeAuto;
     public model: any;
     constructor() {
          const { host, user, password, database, dialect, port } = this.SequelizeAuto
          this.sequelize = new Sequelize(database, user, password, {
               host: host,
               dialect: dialect,
               port: port,
          });
          this.connect();
          this.model = initModels(this.sequelize);
     }
     private async connect(): Promise<void> {
          try {
               await this.sequelize.authenticate();
               console.log('Connection has been established successfully.');
          } catch (error: any) {
               console.error('Unable to connect to the database:', error.message);
          }
     }

}

export {
     SequelizeClient
}