import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfig } from './config/config.interface';
import configuration from './config/configuration';

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
        return {
          type: 'cockroachdb',
          url: database.url,
          ssl: true,
          extra: {
            options: `--cluster=${database.cluster}`,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
