import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connect, Connection } from 'mongoose';
import { MOCK_DATA } from './mock';
import { MovieSchema } from '../../../src/modules/movie/schemas/movie.schema';
import { RoomSchema } from '../../../src/modules/room/schemas/room.schema';
import { isMongoId } from 'class-validator';
import { UserSchema } from '../../../src/modules/user/schemas/user.schema';
import { Crypt } from '../../../src/common/utils/crypt';

export class MongoConnection {
  private mongod: MongoMemoryServer;
  public connection: Connection;
  private collectionList = ['movies', 'rooms', 'users'];

  constructor() {
    this.mongod = null;
    this.connection = null;
  }

  async init(): Promise<void> {
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();
    this.connection = (await connect(uri)).connection;
    await this.createMockData();
  }

  async close() {
    await this.connection.dropDatabase();
    await this.connection.close();
    await this.mongod.stop();
  }

  async clearDatabase() {
    const collections = this.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (!this.collectionList.includes(collection.collectionName)) {
        await collection.deleteMany({});
      }
    }
  }

  private async createMockData() {
    for (const collectionName of this.collectionList) {
      const { schema, schemaOptions } = this.getSchemaOptions(collectionName);
      this.connection.model(schemaOptions.model, schema);
      let collection = this.connection.collection(collectionName);
      if (!collection) {
        await this.connection.createCollection(collectionName, schemaOptions);
        collection = this.connection.collection(collectionName);
      }
      await collection.insertMany(await this.mapJSONData(MOCK_DATA[collectionName]));
    }
  }

  private async mapJSONData(data: any[]) {
    return Promise.all(
      data.map(async (item) => {
        const keys = Object.keys(item);
        for (const key of keys) {
          if (typeof item[key] === 'string' && isMongoId(item[key].toString())) {
            item[key] = new mongoose.Types.ObjectId(item[key]);
          } else if (Array.isArray(item[key])) {
            item[key] = await Promise.all(
              item[key].map(async (subItem: any) => {
                if (typeof subItem === 'string' && isMongoId(subItem.toString())) {
                  return new mongoose.Types.ObjectId(subItem);
                } else if (typeof subItem === 'object') {
                  const subKeys = Object.keys(subItem);
                  for (const subKey of subKeys) {
                    if (typeof subItem[subKey] === 'string' && isMongoId(subItem[subKey].toString())) {
                      subItem[subKey] = new mongoose.Types.ObjectId(subItem[subKey]);
                    }
                  }
                }
                return subItem;
              }),
            );
          } else if (typeof item[key] === 'string' && key === 'password') {
            item[key] = await Crypt.hashPassword(item[key]);
          }
        }
        return item;
      }),
    );
  }

  private getSchemaOptions(collectionName: string) {
    switch (collectionName) {
      case 'movies':
        return {
          schemaOptions: {
            validator: { $jsonSchema: MovieSchema.obj },
            modelName: 'Movie',
            model: 'Movie',
          },
          schema: MovieSchema,
        };
      case 'rooms':
        return {
          schemaOptions: {
            validator: { $jsonSchema: RoomSchema.obj },
            modelName: 'Room',
            model: 'Room',
          },
          schema: RoomSchema,
        };
      case 'users':
        return {
          schemaOptions: {
            validator: { $jsonSchema: UserSchema.obj },
            modelName: 'User',
            model: 'User',
          },
          schema: UserSchema,
        };
      default:
    }
  }
}
