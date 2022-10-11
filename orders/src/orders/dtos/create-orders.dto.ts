import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { OrderPayload } from './order-payload.dto';
export class CreateOrderDto {
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @ApiProperty()
  readonly payload: OrderPayload;
}
