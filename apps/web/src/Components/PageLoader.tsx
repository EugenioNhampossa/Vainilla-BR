import { Center, createStyles, Loader, Paper, Stack } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
}));

export const PageLoader = () => {
  const { classes } = useStyles();
  return (
    <>
      <Paper className={classes.wrapper}>
        <Center style={{ height: "100%" }}>
          <Stack>
            <Loader variant="dots" />
          </Stack>
        </Center>
      </Paper>
    </>
  );
};
