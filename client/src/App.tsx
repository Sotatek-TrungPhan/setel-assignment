import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message } from './components/alert/Message';
import { OrderTable } from './components/common/Table/Table';
import { MainLayout } from './components/layout/MainLayout/MainLayout';
import { Button } from 'antd';
import * as orderService from './services/order-service/order-service';
import { Order, OrderPayload, Orders } from './types/order.type';
import { EVENT_EMIT } from './util/const/event-emit';
import CreateOrder from './components/modal/CreateModal';
function App() {
  const [orders, setOrders] = useState<Orders>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [stateOrder, setStateOrder] = useState<Record<string, string>>({
    id: '',
    state: '',
  });
  const socket = io(
    `ws://${process.env.REACT_APP_SOCKET_HOST}:${process.env.REACT_APP_SOCKET_PORT}`
  );

  useEffect(() => {
    (async () => {
      const orders = await orderService.getAllOrders();
      setOrders(orders.data);
    })();
  }, []);

  useEffect(() => {
    setStateOrder({ id: '', state: '' });
  }, [orders]);

  useEffect(() => {
    socket.on(EVENT_EMIT.UPDATE_STATUS, (data: Order) => {
      if (data) {
        setOrders(
          orders?.map((order: Order) =>
            order.id === data.id ? { ...data } : order
          )
        );
        setStateOrder(Object.assign({}, { id: data.id, state: data.state }));
      }
    });
  }, [orders, socket]);

  const openForm = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleSubmit = (value: OrderPayload) => {
    orderService
      .createOrder({ ...value })
      .then((res: AxiosResponse) => setOrders([...orders, res.data]));
  };

  const cancelOrder = (id: string) => {
    orderService.cancelOrderById(id);
  };

  const viewDetails = (id: string) => {
    console.log(id);
  };

  return (
    <>
      <Button type="primary" onClick={openForm}>
        Create an order
      </Button>
      <MainLayout>
        <OrderTable
          data={orders}
          handleCancelOrder={cancelOrder}
          viewOrderDetails={viewDetails}
        />
        <Message state={stateOrder} />
      </MainLayout>
      <CreateOrder
        isOpenForm={isOpenModal}
        closeModal={openForm}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default App;
