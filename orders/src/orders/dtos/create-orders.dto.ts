import { ApiProperty } from '@nestjs/swagger';
import { OrderPayload } from './order-payload.dto';

export class CreateOrderDto {
  @ApiProperty() readonly payload: OrderPayload;
}
