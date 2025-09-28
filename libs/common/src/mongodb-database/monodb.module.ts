import { Global, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { isDevelopment, MONGODB_URI } from '../data/defaultData';
import Joi from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // console.log(MONGODB_URI);
        const entities = getMetadataArgsStorage()
          .tables.map((tbl) => tbl.target as Function)
          .filter((entity) =>
            entity.toString().toLowerCase().includes('entity'),
          );

        return {
          type: 'mongodb',
          // url: 'mongodb://admin:admin123456@mongo:27017/bookingApp?authSource=admin&retryWrites=true&w=majority',
          //  ||
          url: MONGODB_URI,
          database: configService.get('MONGO_DB'),
          entities,
          logging: true,
          autoLoadEntities: true,
          // useUnifiedTopology: true,
          // useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
  ],

  exports: [TypeOrmModule],
})
export class MongodbModule {}
