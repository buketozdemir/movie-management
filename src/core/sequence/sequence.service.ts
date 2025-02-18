import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sequence, SequenceDocument } from './sequence.schema';
import mongoose from 'mongoose';

@Injectable()
export class SequenceService {
  constructor(@InjectModel(Sequence.name) private SequenceModel: mongoose.Model<SequenceDocument>) {}

  async getSequenceNextValue(code: string) {
    const { value } = await this.SequenceModel.findOneAndUpdate(
      { code },
      { $inc: { value: 1 } },
      { returnNewDocument: true, returnDocument: 'after', upsert: true },
    );
    return value;
  }
}
