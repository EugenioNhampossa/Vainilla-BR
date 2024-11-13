import React from 'react';

interface DataProps {}

interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataProps;
}

const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
  (props, ref) => {
    return <div ref={ref} {...props}></div>;
  },
);

CategoryCard.displayName = 'CategoryCard';

export { CategoryCard };
