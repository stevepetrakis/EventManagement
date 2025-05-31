import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting NestJS application...');
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  
  const port = 5000;
  await app.listen(port);
  
  console.log(`Server is running on: http://localhost:${port}`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
});