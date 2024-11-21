import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from '@src/services';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule, Logger } from 'nestjs-pino';
import { JwtModule } from '@nestjs/jwt';
import { getCacheModuleOptions, getLoggerModuleOptions, getOtelOptions, validate } from '@src/config';
// import { RunProductTokenTask } from './product-token-task';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => getCacheModuleOptions(configService),
    }),
    OpenTelemetryModule.forRootAsync({
      useFactory: async () => getOtelOptions(),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => getLoggerModuleOptions(configService, 'CMD_'),
    }),
    ServicesModule,
  ],
  providers: [],
})
export class AppModule {}
