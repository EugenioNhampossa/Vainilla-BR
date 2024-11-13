import { Grid, NumberInput, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setNota } from '../Store/contador/contador-slice';
import { RootState } from '../Store';

interface PosPaymentCounterProps {
  valorDaNota: "POS";
  label: string;
}

function PosPaymentCounter({ valorDaNota, label }: PosPaymentCounterProps) {
  const dispatch = useDispatch();
  const amount = useSelector((state: RootState) => state.contador[valorDaNota.toString()]);

  const handleChange = (value: number | undefined) => {
    dispatch(setNota({ denomination: valorDaNota.toString(), amount: value || 0 }));
  };

  return (
    <>
      <Grid.Col span={2}>
        <Text>{label} em {valorDaNota}</Text>
      </Grid.Col>

      <Grid.Col span={2}>
        <NumberInput
          variant="filled"
          placeholder="Enter amount"
          type="number"
          min={0}
          precision={2}
          withAsterisk
          value={amount}
          onChange={handleChange}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Text>= {amount} MT</Text>
      </Grid.Col>
    </>
  );
}

export default PosPaymentCounter;
