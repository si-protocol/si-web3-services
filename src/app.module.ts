import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule, Logger } from 'nestjs-pino';
import { ApiModule } from '@src/api/api.module';
import { getCacheModuleOptions, getLoggerModuleOptions, getOtelOptions, validate } from '@src/config';
import { PaymentModule } from '@src/payment/payment.module';

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
      useFactory: async (configService) => getLoggerModuleOptions(configService),
    }),
    ApiModule,
    ScheduleModule.forRoot(),
    PaymentModule,
  ],
})
export class AppModule {}
