import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongodbModule } from './mongodb-database/monodb.module';
import { ConfigModule } from './config/config.module';
import { PostgresModule } from './postgresql-database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ConfigModule,
    //MongodbModule,
    PostgresModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        // secret: configService.get<string>('JWT_SECRET'),
        // secret: configService.get('JWT_SECRET'),
        secret: process.env.JWT_SECRET,
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
        signOptions: { expiresIn: '31' },
      }),
    }),
  ],
})
export class CommonModule {}
