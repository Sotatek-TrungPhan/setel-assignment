import { BaseEntity } from '../../common/entity/base.entity';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { Column, Entity } from 'typeorm';
import { IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';

@Entity()
export class Orders extends BaseEntity {
  @Column({ type: 'json', nullable: false })
  @IsNotEmptyObject()
  @ValidateNested()
  payload: {
    name: string;
    email: string;
    price: number;
    quantity: number;
  };

  @Column({ default: OrderStatus.CREATED, nullable: false })
  @IsNotEmpty({ message: 'State must is required' })
  state: OrderStatus;
}
