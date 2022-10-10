import { BaseEntity } from '../../common/entity/base.entity';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class Orders extends BaseEntity {
  @Column({ type: 'json' })
  payload: {
    name: string;
    email: string;
    price: number;
    quantity: number;
  };

  @Column({ default: OrderStatus.CREATED })
  state: OrderStatus;
}
