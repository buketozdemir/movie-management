import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
class MongoConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions | any {
    const uri = this.configService.get<string>('MONGODB.URI');
    return {
      serverSelectionTimeoutMS: 60000,
      uri,
      autoIndex: true,
    };
  }
}

export default MongoConfigService;
