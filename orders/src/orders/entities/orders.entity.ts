import { BaseEntity } from '../../common/entity/base.entity';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { Column, Entity } from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderPayload } from '../../orders/dtos/order-payload.dto';

@Entity()
export class Orders extends BaseEntity {
  @Column({ type: 'json', nullable: false })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OrderPayload)
  payload: {
    name: string;
    email: string;
    price: number;
    quantity: number;
  };

  @Column({ default: OrderStatus.CREATED, nullable: false })
  @IsNotEmpty({ message: 'State must be required' })
  @IsEnum(OrderStatus)
  state: OrderStatus;
}
