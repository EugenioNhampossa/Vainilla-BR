import { Loader, Select, Text, type SelectItemProps } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons';
import { useState } from 'react';
import { UseFormReturnType } from '@mantine/form';

// Define the type for the fetch function
type FetchFunction = (params: {
  onError: (error: Error) => void;
  filter: { titulo: string };
  page: number;
  perPage: number;
  enabled: boolean;
  select: (data: any) => SelectItemProps[];
  idFilter?: any;
}) => { data: any; isLoading: boolean };

// Define the props for SearchableSelect as a generic type
interface SelectFamilyProps<T> {
  form: UseFormReturnType<T>;
  fetchFuntion: FetchFunction;
  labelText: string;
  onErrorMessage: string;
  idFilter?: any;
  placeholder: string;
  name: keyof T;
  onChange?: (value: string) => void;
  onNewOptionSelect?: () => void;
}

export function SelectFamilyInput<T>({
  form,
  fetchFuntion,
  labelText,
  onErrorMessage,
  idFilter,
  placeholder,
  name,
  onChange,
  onNewOptionSelect,
}: SelectFamilyProps<T>) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
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
    return (
      entitieData?.data?.data.map((entitie: any) => ({
        value: entitie.id,
        label: entitie.titulo
          ? entitie.titulo + ''
          : entitie.nome
            ? entitie.nome + ''
            : entitie.username + '',
      })) || []
    );
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

  const handleChange = (value: string) => {
    if (value === 'new') {
      if (onNewOptionSelect) {
        onNewOptionSelect();
      }
    } else if (onChange) {
      onChange(value);
    }
  };

  const newItem: SelectItemProps = {
    value: 'new',
    label: 'Adicionar nova Família',
  };

  return (
    <Select
      allowDeselect={false}
      clearable
      rightSection={isLoading && <Loader size="xs" />}
      size="sm"
      variant="filled"
      name={name as string}
      placeholder={placeholder}
      nothingFound="Sem opções"
      label={labelText}
      data={[...(entities || []), newItem]}
      searchable
      onChange={handleChange} // Ensure this is set once
      onSearchChange={(value) => {
        setPage(1);
        setTitulo(value);
        setQueryEnabled(true);
      }}
      // {...form.getInputProps(name as string)} // Make sure this is last to avoid overwriting
    />
  );
}
