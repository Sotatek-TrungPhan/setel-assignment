import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderStatus } from 'common/enum/order-status.enum';
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
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Server error',
    type: 'Server error',
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
    const res = await this.orderService.create(createOrderDto);
    return res;
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
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Order Id must be required',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  async cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Orders> {
    const { state } = await this.orderService.getStatusById(id);
    if (state === OrderStatus.DELIVERED) {
      throw new BadRequestException(400, "Can't cancel an order");
    }
    const res = await this.orderService.cancelById(id);
    return res;
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
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Order Id must be required',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  async fetchById(@Param('id') id: string): Promise<Orders> {
    if (!id) {
      throw new BadRequestException(
        400,
        'Bad request. Order Id must be required',
      );
    }
    const res = await this.orderService.cancelById(id);
    if (!res) {
      throw new NotFoundException(404, 'Not found');
    }
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
    const { state } = await this.orderService.getStatusById(data.id);
    if (state === OrderStatus.CANCELLED) {
      throw new BadRequestException(400, "An order can't confirm");
    }
    return this.orderService.confirmById(data.id);
  }

  @EventPattern(EVENT_EMIT.PAYMENT_DECLINED)
  async handlePaymentDeclined(data: IPayment): Promise<Orders> {
    return this.orderService.cancelById(data.id);
  }
}
