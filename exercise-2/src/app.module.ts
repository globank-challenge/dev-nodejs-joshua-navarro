import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfig } from './config/config.interface';
import { OrganizationsModule } from './models/organizations/organizations.module';
import configuration from './config/configuration';
import { Organization } from './models/organizations/entities/organization.entity';

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
        console.log(database);

        return {
          type: 'cockroachdb',
          url: database.url,
          ssl: true,
          entities: [Organization],
          extra: {
            options: `--cluster=${database.cluster}`,
          },
          synchronize: true,
        };
      },
    }),
    OrganizationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
