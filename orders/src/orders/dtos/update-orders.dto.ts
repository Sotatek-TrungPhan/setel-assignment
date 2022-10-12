import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { OrderPayload } from './order-payload.dto';
export class UpdateOrderDto {
  @ApiProperty()
  @ValidateNested()
  readonly payload: OrderPayload;
  @ApiProperty({ enum: OrderStatus })
  readonly state: OrderStatus;
}
