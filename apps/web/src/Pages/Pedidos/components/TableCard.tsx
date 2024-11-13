import { Divider, Text } from '@mantine/core';
import { IconArrowDown, IconLock, IconPlus } from '@tabler/icons';
import React from 'react';
import { BillItem } from '../../../Store/pedido/pedido-slice';
import { currentHour } from '../../../utils/CurrentHour';

interface TableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BillItem;
  index: number;
}

const TableCard = React.forwardRef<HTMLDivElement, TableCardProps>(
  (props, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="grid grid-cols-12 cursor-pointer">
          <div className="flex items-center justify-center">
            {props.data.confirmado ? (
              <IconLock color="green" size={18} />
            ) : (
              <IconPlus size={16} />
            )}
          </div>
          <div className="col-span-10 flex flex-col">
            <Text weight="bold" size="sm">
              {props.data.titulo}
            </Text>
            <div className="flex gap-2 text-sm">
              <span>{`#${props.index}`}</span>
              <span>
                {props.data.hora ||
                  currentHour(new Date(props.data.dataCriacao))}
              </span>
              <Text weight="bold">{props.data.preco.toFixed(2)}</Text>
              <Text weight="bold" className="flex items-center">
                {props.data.desconto != props.data.preco && (
                  <IconArrowDown size={14} />
                )}
                {props.data.desconto.toFixed(2)}
              </Text>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Text weight="bold">{props.data.quantidade}</Text>
          </div>
        </div>
        <Divider variant="dashed" className="my-1" />
      </div>
    );
  },
);

TableCard.displayName = 'TableCard';

export { TableCard };
