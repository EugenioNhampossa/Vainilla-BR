import { ReactNode, useState } from 'react';
import { Drawer } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { layoutAction } from '../Store/layout/layout-slice';

interface AsideDrawerProps {
  children: ReactNode;
  title?: string;
}

export function AsideDrawer({ children, title }: AsideDrawerProps) {
  const opened = useSelector((state: any) => state.layout.drawer.opened);
  const dispatch = useDispatch();

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => dispatch(layoutAction.toggleDrawer())}
        closeOnClickOutside={true}
        title={title}
        position="right"
        padding="md"
        withCloseButton={false}
        size={'md'}
        withOverlay={false}
      >
        {children}
      </Drawer>
    </>
  );
}
