import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfig } from './config/config.interface';
import { RepositoriesModule } from './models/repositories/repositories.module';
import { TribesModule } from './models/tribes/tribes.module';
import configuration from './config/configuration';
import { Organization } from './models/tribes/entities/organization.entity';
import { Tribe } from './models/tribes/entities/tribe.entity';
import { Repository } from './models/tribes/entities/repository.entity';
import { Metrics } from './models/tribes/entities/metrics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const database = config.get<IDatabaseConfig>('database');
        const env = config.get<string>('env');

        return {
          type: 'cockroachdb',
          url: database.url,
          ssl: env !== 'test',
          entities: [Organization, Tribe, Repository, Metrics],
          extra: {
            options: `--cluster=${database.cluster}`,
          },
          synchronize: true,
        };
      },
    }),
    RepositoriesModule,
    TribesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
