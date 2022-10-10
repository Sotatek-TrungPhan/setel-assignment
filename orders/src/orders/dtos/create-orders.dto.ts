import { ApiProperty } from '@nestjs/swagger';
import { OrderPayload } from './order-payload.dto';
import { IsNotEmptyObject } from 'class-validator';
export class CreateOrderDto {
  @IsNotEmptyObject()
  @ApiProperty()
  readonly payload: OrderPayload;
}
