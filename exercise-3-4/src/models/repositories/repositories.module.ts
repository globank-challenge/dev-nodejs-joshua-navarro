import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from '../tribes/entities/repository.entity';
import { RepositoriesService } from './repositories.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configServise: ConfigService) => {
        return {
          baseURL: configServise.get('server.repositoryUri'),
        };
      },
    }),
    TypeOrmModule.forFeature([Repository]),
  ],
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
