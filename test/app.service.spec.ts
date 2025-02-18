import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config';
import { AppService } from '../src/app.service';

describe('AppService', () => {
  let testingModule: TestingModule;
  let appService: AppService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [AppService],
    }).compile();

    appService = testingModule.get<AppService>(AppService);
  });

  it('DecisionService should be defined', () => {
    expect(appService).toBeDefined();
  });
});
