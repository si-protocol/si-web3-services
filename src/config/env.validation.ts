import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @Expose()
  @IsString()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Expose()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  HTTP_PORT: number;

  @Expose()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  LOG_PRETTY: boolean;

  @Expose()
  @IsString()
  OTLP_SERVICE_NAME: string;

  @Expose()
  @IsString()
  LOG_LOKI: string;

  @Expose()
  @IsString()
  LOG_LEVEL: string;

  @Expose()
  @IsString()
  LOG_FILE: string;

  @Expose()
  @IsString()
  WALLET_PRIVATE_KEY: string;

  // portal events
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  CHIAN_ID: number = 10;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  START_BLOCK_NUMBER: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  BLOCK_EPOCH: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  VERIFY_BLOCKS: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  START_BLOCK: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  MOCK_LOTTERY_THRESHOLD: number = 0;
}

export function validate(config: Record<string, string>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
