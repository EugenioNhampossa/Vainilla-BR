import {
  Button,
  Group,
  MantineColor,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { TablerIcon } from "@tabler/icons";

export const MessageModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{
  modalBody: string;
  modalIcon: TablerIcon;
  color: MantineColor;
}>) => (
  <>
    <Paper withBorder py="md">
      <Stack align={"center"} justify={"center"}>
        <innerProps.modalIcon color={innerProps.color} size={70} stroke={1.5} />
        <Text size="md" fw="bold" align="justify">
          {innerProps.modalBody}
        </Text>
      </Stack>
    </Paper>
    <Group position="right">
      <Button mt="md" onClick={() => context.closeModal(id)}>
        Fechar
      </Button>
    </Group>
  </>
);
