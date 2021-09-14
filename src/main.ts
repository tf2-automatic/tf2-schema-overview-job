import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { SchemaService } from './schema/schema.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  const logger = new Logger();

  const appService = app.get(AppService);
  const schemaService = app.get(SchemaService);

  logger.log('Getting schema overview... ');

  const schemaOverview = await schemaService.getSchemaOverview();
  const result = schemaOverview.result;

  if (result.status != 1) {
    throw new Error(result.note);
  }

  const qualities = appService.getQualities(result);
  const effects = appService.getEffects(result);

  logger.log('Saving overview...');

  await Promise.all([
    schemaService.saveQualities(qualities),
    schemaService.saveEffects(effects),
  ]);

  logger.log('Done');

  await app.close();
}
bootstrap();
