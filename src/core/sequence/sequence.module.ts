import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Sequence, SequenceSchema } from './sequence.schema';
import { SequenceService } from './sequence.service';

@Global()
@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: Sequence.name, schema: SequenceSchema }])],
  providers: [SequenceService],
  exports: [SequenceService],
})
export default class SequenceModule {}
