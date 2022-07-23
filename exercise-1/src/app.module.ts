import { Module } from '@nestjs/common';
import { RepositoriesModule } from './models/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
