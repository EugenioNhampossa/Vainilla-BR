import { Paper, PaperProps } from '@mantine/core';
import React from 'react';

interface DataProps {}

interface ProdCardProps extends PaperProps {
  data: DataProps;
  title: string;
}

const ProdCard = React.forwardRef<HTMLDivElement, ProdCardProps>(
  (props, ref) => {
    return (
      <Paper ref={ref} {...props}>
        {props.title}
      </Paper>
    );
  },
);

ProdCard.displayName = 'ProdCard';

export { ProdCard };
