import { Button, Paper, Table, Text } from '@mantine/core';
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { useAppSelector } from '../../../hooks/appStates';
import { useCalc } from '../hooks/useCalc';
import { closeAllModals } from '@mantine/modals';

const options: Options = {
  method: 'open',
  resolution: Resolution.EXTREME,
  page: {
    margin: Margin.LARGE,
    orientation: 'portrait',
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
};

// you can use a function to return the target element besides using React refs
const getTargetElement = () => document.getElementById('content-id');

export const Recibo = () => {
  const pedido = useAppSelector((state) => state.pedido);
  const { total, totalLiq } = useCalc(pedido);
  return (
    <div>
      <div className="mb-5 flex gap-4">
        <Button onClick={() => generatePDF(getTargetElement, options)}>
          Imprimir
        </Button>
        <Button color="red" variant="light" onClick={() => closeAllModals()}>
          Fechar
        </Button>
      </div>
      <div id="content-id" className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Text className="text-4xl" c="blue" fw="bolder">
              LOGO
            </Text>
            <Text size="sm">NUIT: 8397400284</Text>
            <Text size="sm">Código postal: 1112</Text>
            <Text size="sm">Província: Maputo</Text>
            <Text size="sm">Endereço: Matola, Av. Das Indústrias nr.1003</Text>
          </div>
          <div>
            <Text size="lg" fw="bold">
              Recibo
            </Text>
            <Text size="sm">Pedido nr: {pedido.codigo}</Text>
            <Text size="sm">Data: {new Date().toLocaleDateString()}</Text>
            <Text size="sm">Cliente: {pedido.Cliente?.nome}</Text>
            <Text size="sm">Nuit: {pedido.Cliente?.nuit}</Text>
          </div>
        </div>
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço unitário</th>
              <th>Desconto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pedido.ItemPedido.map((produto) => {
              let precoTotal = produto.preco * produto.quantidade;
              let desconto = (precoTotal * produto.desconto) / 100;
              return (
                <tr key={produto.id}>
                  <td>{produto.titulo}</td>
                  <td>{produto.quantidade}</td>
                  <td>{`${produto.preco.toFixed(2)} MT`}</td>
                  <td>{`${desconto.toFixed(2)} MT`}</td>
                  <td>{`${(precoTotal - desconto).toFixed(2)} MT`}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="flex justify-between items-center rounded-none gap-4">
          <Paper withBorder className="flex-grow text-center py-1">
            <Text fw="bold" size="md">
              Total
            </Text>
            <Text size="md">{`${total.toFixed(2)} MT`}</Text>
          </Paper>
          <Paper withBorder className="flex-grow text-center py-1">
            <Text fw="bold" size="md">
              Desconto
            </Text>
            <Text size="md">{`${pedido.desconto.toFixed(2)} %`}</Text>
          </Paper>
          <Paper withBorder className="flex-grow text-center py-1">
            <Text fw="bold" size="md">
              Valor Pago
            </Text>
            <Text
              fw="bold"
              c="blue"
              size="md"
            >{`${totalLiq.toFixed(2)} MT`}</Text>
          </Paper>
        </div>
      </div>
    </div>
  );
};
