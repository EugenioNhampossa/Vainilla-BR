import { Button, ButtonProps, MantineColor, Text } from '@mantine/core';
import React, { ReactElement } from 'react';

interface CXButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement;
  text: string;
  color?: MantineColor;
}

const CXButton = React.forwardRef<HTMLButtonElement, CXButtonProps>(
  ({ icon, text, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      className="h-[55px] w-[116px] px-0 rounded-none"
    >
      <div className="flex flex-col items-center">
        {icon}
        <Text size="sm">{text}</Text>
      </div>
    </Button>
  ),
);

CXButton.displayName = 'CXButton';

export { CXButton };
