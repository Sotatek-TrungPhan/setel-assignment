import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { OrderPayload } from './order-payload.dto';
export class CreateOrderDto {
  @IsNotEmptyObject()
  @ApiProperty()
  readonly payload: OrderPayload;
}
