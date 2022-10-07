import { Order } from '../../types/order.type';
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import { getOrderDetails } from '../../services/order-service/order-service';
import { useParams } from 'react-router-dom';
export const OrderDetails: React.FC<Order> = ({
  createdAt,
  updatedAt,
  state,
  payload,
}) => {
  const [order, setOrder] = useState<Order>();
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const { data } = await getOrderDetails(id || '');
      setOrder(data);
    })();
  }, [id]);
  return (
    <>
      <ul>
        <li>{order?.state}</li>
        <li>{order?.payload.name}</li>
        <li>{order?.payload.price}</li>
        <li>{order?.state}</li>
        <li>{order?.payload.email}</li>
        <li>{order?.updatedAt.toISOString()}</li>
      </ul>
      <Button type="primary">Back to previous</Button>
    </>
  );
};
