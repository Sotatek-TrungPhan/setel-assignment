import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dtos/create-orders.dto';
import { Orders } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersServices } from './orders.service';

describe('Order Controller', () => {
  let orderController: OrdersController;
  let orderService: OrdersServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => {
            return {
              type: 'postgres',
              host: 'localhost',
              port: 5432,
              username: 'postgres',
              password: 'admin',
              database: 'orders-management',
              autoLoadEntities: true,
              synchronize: true,
            };
          },
        }),
        ConfigModule,
        TypeOrmModule.forFeature([Orders]),
      ],
      controllers: [OrdersController],
      providers: [OrdersServices, EventsGateway],
    }).compile();
    orderController = module.get<OrdersController>(OrdersController);
    orderService = module.get<OrdersServices>(OrdersServices);
  });

  describe('Create Orders', () => {
    it('Service create order should be called ', async () => {
      const order = {
        id: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        state: 'create' as any,
        payload: {
          name: 'test',
          email: 'test',
          quantity: 1,
          price: 1,
        },
      };
      const service = jest
        .spyOn(orderService, 'create')
        .mockImplementation(() => new Promise((resolve) => resolve(order)));
      await orderController.create(new CreateOrderDto());
      expect(service).toBeCalled();
    });
  });

  describe('Get All Orders', () => {
    it('Service getAll order should be called ', async () => {
      const orders = [
        {
          id: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'create' as any,
          payload: {
            name: 'test',
            email: 'test',
            quantity: 1,
            price: 1,
          },
        },
      ];
      const service = jest
        .spyOn(orderService, 'getAll')
        .mockImplementation(() => new Promise((resolve) => resolve(orders)));
      await orderController.fetchAll();
      expect(service).toBeCalled();
    });
  });

  describe('Get By Orders Id', () => {
    it('Service getById should be called', async () => {
      const order = {
        id: '1cfe9810-1b9a-4128-9155-9d19a63910002',
        createdAt: new Date(),
        updatedAt: new Date(),
        state: 'create' as any,
        payload: {
          name: 'test',
          email: 'test',
          quantity: 1,
          price: 1,
        },
      };
      const service = jest
        .spyOn(orderService, 'getById')
        .mockImplementation(() => new Promise((resolve) => resolve(order)));
      await orderController.fetchById('1cfe9810-1b9a-4128-9155-9d19a63910002'),
        expect(service).toBeCalled();
    });
  });

  describe('Cancel order by id', () => {
    it('Service canclled order should be called', async () => {
      const order = {
        id: '1cfe9810-1b9a-4128-9155-9d19a63910002',
        createdAt: new Date(),
        updatedAt: new Date(),
        state: 'cancelled' as any,
        payload: {
          name: 'test',
          email: 'test',
          quantity: 1,
          price: 1,
        },
      };
      const service = jest
        .spyOn(orderService, 'cancelById')
        .mockImplementation(() => new Promise((resolve) => resolve(order)));
      await orderController.cancel('1cfe9810-1b9a-4128-9155-9d19a63910002'),
        expect(service).toBeCalled();
    });
  });
});
