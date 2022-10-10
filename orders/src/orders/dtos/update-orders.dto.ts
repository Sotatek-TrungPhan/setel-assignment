import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'common/enum/order-status.enum';
import { OrderPayload } from './order-payload.dto';
export class UpdateOrderDto {
  @ApiProperty()
  readonly payload: OrderPayload;
  @ApiProperty()
  readonly state: OrderStatus;
}
