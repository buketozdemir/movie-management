import { AppModule } from './app.module';
import { HeaderInterceptor } from './common/interceptors';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter';
import { UserInfoInterceptor } from './common/interceptors/user-info.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const swaggerOptions = configService.get('SWAGGER_OPTIONS' as any);
  const port = configService.get<number>('PORT' as any);
  const config = new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document, {
    explorer: false,
    customSiteTitle: configService.get<string>('NAME'),
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      operationsSorter: 'alpha',
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new UserInfoInterceptor(), new HeaderInterceptor());

  if (!process.env.DONT_USE_GRACEFULL_SHUTDOWN) app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
  Logger.log('Application Started: ' + port);
}
bootstrap().catch((err) => {
  Logger.error(err);
});
