import { NumberInput, Stack, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectTotalSum } from '../Store/contador/selectTotalSumSelector';

function SessionClosureComputedValues({
  total,
  totalPOS,
}: {
  total: number;
  totalPOS: number;
}) {
  const amount = useSelector(selectTotalSum);

  return (
    <Stack>
      <Text size={'md'}>Dados obtidos pelo sistema</Text>
      {/* Commented because I do not see the need of this one */}
      {/* <NumberInput
        variant='filled'
        label="Valor obtido em numerario"
        placeholder='20000,00'
        type='number'
        min={0}
        precision={2}
        mt="sm"
        withAsterisk
        className='w-1/2'
      /> */}
      <NumberInput
        variant="filled"
        label="Total em numerario"
        placeholder="20000,00"
        type="number"
        min={0}
        precision={2}
        mt="sm"
        className="w-3/4"
        disabled={true}
        value={amount}
      />
      {/* Commented because I do not see the need of this one */}
      {/* <NumberInput
        variant='filled'
        label="Valor obtipo pelo POS"
        placeholder='20000,00'
        type='number'
        min={0}
        precision={2}
        mt="sm"
        withAsterisk
        className='w-3/4'
      /> */}
      <NumberInput
        variant="filled"
        label="Total obtido pelo POS"
        type="number"
        min={0}
        precision={2}
        mt="sm"
        className="w-3/4"
        disabled={true}
        value={totalPOS}
      />
      <NumberInput
        variant="filled"
        label="Total em Vendas"
        type="number"
        min={0}
        precision={2}
        mt="sm"
        className="w-3/4"
        disabled
        value={total}
      />
      <NumberInput
        variant="filled"
        label="Diferenca entre vendas e valor total"
        type="number"
        min={0}
        precision={2}
        mt="sm"
        className="w-3/4"
        disabled
        value={total - (amount + totalPOS)}
      />
    </Stack>
  );
}

export { SessionClosureComputedValues };
