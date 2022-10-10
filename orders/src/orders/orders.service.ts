import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_EMIT } from 'common/const/event-emit';
import { OrderStatus } from 'common/enum/order-status.enum';
import { EventsGateway } from 'events/events.gateway';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-orders.dto';
import { UpdateOrderDto } from './dtos/update-orders.dto';
import { Orders } from './entities/orders.entity';

@Injectable()
export class OrdersServices {
  private clientProxy: ClientProxy;
  public DELIVERY_TIMEOUT: number;
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,
    private eventGateway: EventsGateway,
    private configService: ConfigService,
  ) {
    this.clientProxy = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT')),
      },
    });
    this.DELIVERY_TIMEOUT = configService.get('DELIVERY_TIMEOUT');
  }

  async updateById(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Orders> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Orders> {
    const order = {
      ...new Orders(),
      ...createOrderDto,
      state: OrderStatus.CREATED,
    };
    const createdOrder = await this.orderRepository.save(order);
    this.clientProxy.emit(EVENT_EMIT.CREATE_ORDER, order);
    return createdOrder;
  }

  async getById(id: string): Promise<Orders> {
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async getAll(): Promise<Orders[]> {
    return this.orderRepository.find();
  }

  async getStatusById(id: string): Promise<Orders> {
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async cancelById(id: string): Promise<Orders> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
    });

    if (order && order.state !== OrderStatus.DELIVERED)
      await this.orderRepository
        .createQueryBuilder()
        .update(Orders)
        .set({ state: OrderStatus.CANCELLED })
        .where('id =:id', { id: id })
        .execute();
    //fire event to client-side
    this.eventGateway.updateStatus(
      await this.orderRepository.findOne({ where: { id: id } }),
    );
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async confirmById(id: string): Promise<Orders> {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (order.state !== OrderStatus.CANCELLED) {
      await this.orderRepository
        .createQueryBuilder()
        .update(Orders)
        .set({ state: OrderStatus.CONFIRMED })
        .where('id =:id', { id: id })
        .execute();
      //fire event to client-side
      this.eventGateway.updateStatus(
        await this.orderRepository.findOne({ where: { id: id } }),
      );
      this.deliver(order.id);
    }

    return this.orderRepository.findOne({ where: { id: id } });
  }

  async deliver(id: string): Promise<Orders> {
    return new Promise(async (resolve) => {
      const order = await this.orderRepository.findOne({ where: { id: id } });
      if (order && order.state === OrderStatus.CONFIRMED) {
        setTimeout(async () => {
          await this.orderRepository
            .createQueryBuilder()
            .update(Orders)
            .set({ state: OrderStatus.DELIVERED })
            .where('id =:id', { id: id })
            .execute();
          resolve(this.orderRepository.findOne({ where: { id: order.id } }));
          //fire event to client-side
          this.eventGateway.updateStatus(
            await this.orderRepository.findOne({ where: { id: id } }),
          );
        }, Number(this.DELIVERY_TIMEOUT));
      } else {
        resolve(order);
      }
    });
  }
}
