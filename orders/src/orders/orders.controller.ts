import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { IPayment } from 'common/interface/payment.interface';
import { EVENT_EMIT } from './../common/const/event-emit';

import { CreateOrderDto } from './dtos/create-orders.dto';
import { ResponseOrderDto } from './dtos/response-order.dto';
import { Orders } from './entities/orders.entity';
import { OrdersServices } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private orderService: OrdersServices) {}

  @Post()
  @ApiOperation({ description: 'Create new order' })
  @ApiResponse({ status: 200, type: ResponseOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
    return this.orderService.create(createOrderDto);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Cancel order by id' })
  @ApiResponse({ status: 204, type: ResponseOrderDto })
  @ApiParam({
    name: 'id',
    description: 'Order id',
    required: true,
    type: '',
  })
  async cancel(@Param('id') id: string): Promise<Orders> {
    return this.orderService.cancelById(id);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get order by id' })
  @ApiResponse({ status: 200, type: ResponseOrderDto })
  @ApiParam({
    name: 'id',
    description: 'Order id',
    required: true,
    type: '',
  })
  async fetchById(@Param('id') id: string): Promise<Orders> {
    return this.orderService.getById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all orders' })
  @ApiResponse({ status: 200, type: ResponseOrderDto, isArray: true })
  async fetchAll(): Promise<Orders[]> {
    return this.orderService.getAll();
  }

  @EventPattern(EVENT_EMIT.PAYMENT_CONFIRMED)
  async handlePaymentConfirm(data: IPayment): Promise<Orders> {
    return this.orderService.confirmById(data.id);
  }

  @EventPattern(EVENT_EMIT.PAYMENT_DECLINED)
  async handlePaymentDeclined(data: IPayment): Promise<Orders> {
    return this.orderService.cancelById(data.id);
  }
}
