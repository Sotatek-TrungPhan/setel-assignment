import { AxiosError, AxiosResponse } from 'axios';
import { ORDER_API } from '../api-service';
import axios from '../axios-config';
import { Order, OrderPayload } from './../../types/order.type';

export const getAllOrders = async (): Promise<AxiosResponse> => {
  return await axios.get(ORDER_API);
};

export const getOrderDetails = async (
  orderId: string
): Promise<AxiosResponse> => {
  return await axios.get(`${ORDER_API}/:${orderId}`);
};

export const createOrder = async (
  payload: OrderPayload
): Promise<AxiosResponse> => {
  return await axios.post(`${ORDER_API}`, { payload: payload });
};

export const cancelOrderById = async (
  orderId: string
): Promise<AxiosResponse> => {
  return await axios.patch(`${ORDER_API}/${orderId}`);
};
