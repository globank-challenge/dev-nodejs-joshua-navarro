import { Module } from '@nestjs/common';
import { RepositoriesController } from './models/repositories/repositories.controller';
import { RepositoriesService } from './models/repositories/repositories.service';

@Module({
  imports: [],
  controllers: [RepositoriesController],
  providers: [RepositoriesService],
})
export class AppModule {}
