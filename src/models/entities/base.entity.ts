import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Prop } from '@src/common/decorators';

export type Decimal = any;

export class BaseEntity  {
  @ApiProperty()
  id: string;

  @ApiProperty()
  _id: string | null;

  @ApiProperty()
  __v: string | null;

  @ApiProperty()
  createdAt: Date | null;

  @ApiProperty()
  updatedAt: Date | null  ;
}

export { ApiProperty, Prop, ApiHideProperty };