import { Table } from 'antd';
import { Orders } from '../../../types/order.type';
import { COLUMNS } from './Table.config';
import classes from './Table.module.scss';

type IDataTable = {
  data: Orders;
  handleCancelOrder: (id: string) => void;
  viewOrderDetails: (id: string) => void;
};

export const OrderTable: React.FC<IDataTable> = ({
  data,
  handleCancelOrder,
  viewOrderDetails,
}) => {
  console.log('🚀 ~ file: Table.tsx ~ line 17 ~ data', data);
  return (
    <div className={classes.tableContainer}>
      <Table
        rowKey="id"
        dataSource={data}
        columns={COLUMNS(handleCancelOrder, viewOrderDetails)}
      ></Table>
    </div>
  );
};
