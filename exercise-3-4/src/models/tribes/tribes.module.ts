import { Module } from '@nestjs/common';
import { TribesService } from './tribes.service';
import { TribesController } from './tribes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tribe } from './entities/tribe.entity';
import { RepositoriesModule } from '../repositories/repositories.module';
import { Repository } from './entities/repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tribe, Repository]), RepositoriesModule],
  providers: [TribesService],
  controllers: [TribesController],
})
export class TribesModule {}
