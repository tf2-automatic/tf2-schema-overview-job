import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Quality } from './schema/interfaces/quality.interface';
import { SchemaService } from './schema/schema.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  const logger = new Logger();

  const schemaService = app.get(SchemaService);

  logger.log('Getting schema overview... ');

  const schemaOverview = await schemaService.getSchemaOverview();
  const result = schemaOverview.result;

  if (result.status != 1) {
    throw new Error(result.note);
  }

  const qualities: Quality[] = [];

  for (const internal in result.qualityNames) {
    const name = result.qualityNames[internal];
    const id = result.qualities[internal];

    qualities.push({ id, name });
  }

  logger.log('Saving qualities...');

  await schemaService.saveQualities(qualities);

  logger.log('Done');

  await app.close();
}
bootstrap();
