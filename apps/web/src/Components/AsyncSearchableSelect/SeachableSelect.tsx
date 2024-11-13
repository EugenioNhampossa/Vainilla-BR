import { Loader, Select, Text } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons';
import { useEffect, useState } from 'react';

export interface selectProps {
  initialValue: {};
}

export function SearchableSelect({
  form,
  fetchFuntion,
  labelText,
  onErrorMessage,
  idFilter,
  placeholder,
  name,
  onChange
}: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [queryEnabled, setQueryEnabled] = useState(true);
  const [titulo, setTitulo] = useDebouncedState('', 700);

  const onError = (error: Error) => {
    showNotification({
      title: <Text fw="bold">{onErrorMessage}</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const select = (entitieData: any) => {
    const transformedData = entitieData?.data?.data.map((entitie: any) => ({
      value: entitie.id,
      label: entitie.titulo
        ? entitie.titulo + ''
        : entitie.nome
        ? entitie.nome + ''
        : entitie.username + '',
    }));
    return transformedData;
  };

  const { data: entities, isLoading } = fetchFuntion({
    onError,
    filter: { titulo },
    page,
    perPage,
    enabled: queryEnabled,
    select,
    idFilter,
  });


  return (
    <Select
      allowDeselect={false}
      clearable
      rightSection={isLoading && <Loader size="xs" />}
      size="sm"
      variant={'filled'}
      name={name}
      placeholder={placeholder}
      nothingFound="Sem opções"
      label={labelText}
      data={entities || []}
      searchable
      onSearchChange={(value) => {
        setPage(1);
        setTitulo(value);
        setQueryEnabled(true);
      }}
      {...form?.getInputProps(name)}
    />
  );
}
