import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfig } from './config/config.interface';
import { OrganizationsModule } from './models/organizations/organizations.module';
import configuration from './config/configuration';
import { Organization } from './models/organizations/entities/organization.entity';
import { APP_PIPE } from '@nestjs/core';

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
          ssl: env === 'production',
          entities: [Organization],
          extra: {
            options: `--cluster=${database.cluster}`,
          },
          synchronize: env === 'test',
        };
      },
    }),
    OrganizationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
