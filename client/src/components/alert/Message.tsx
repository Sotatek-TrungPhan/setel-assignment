import { message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { OrderStates } from '../../util/enum/OrderStates';
import classes from './Message.module.scss';
interface IMessage {
  state: Record<string, string>;
}

const MESSAGE_MAPPING: Record<string, string> = {
  deliveried: 'An order has been deliveried!',
  confirmed: 'An order has been confirmed!',
  created: 'An order has been created!',
  cancelled: 'An order has been cancelled!',
};

export const Message: React.FC<IMessage> = ({ state }) => {
  console.log('🚀 ~ file: Message.tsx ~ line 17 ~ state', state);
  // const [open, setOpen] = useState(false);
  // const closeMessage = () => {
  //   setOpen(true);
  //   setTimeout(() => {
  //     setOpen(false);
  //   }, 4000);
  // };

  // useEffect(() => {
  //   closeMessage();
  // }, [state]);

  const showMessage = useCallback((state: string) => {
    switch (state) {
      case OrderStates.CANCELLED:
        message.error(MESSAGE_MAPPING[state], 3);
        break;
      case OrderStates.CREATED:
        message.warning(MESSAGE_MAPPING[state], 3);
        break;
      case OrderStates.CONFIRMED:
        message.success(MESSAGE_MAPPING[state], 3);
        break;
      case OrderStates.DELIVERIED:
        message.info(MESSAGE_MAPPING[state], 3);
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className={classes.container}>
      {state.state && <> {showMessage(state.state)}</>}
    </div>
  );
};
