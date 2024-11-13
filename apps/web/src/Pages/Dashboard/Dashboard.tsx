import { Container, Grid, Paper, Skeleton } from "@mantine/core";
import { TitleBar } from "../../Components/TitleBar";

const child = <Skeleton height={140} radius="md" animate={false} />;

export const Dashboard = () => {
  return (
    <>
      <TitleBar title="Dashboard" />
      <Paper>
        <Container my="xl" py={"md"} size={"lg"}>
          <Grid>
            <Grid.Col xs={4}>{child}</Grid.Col>
            <Grid.Col xs={8}>{child}</Grid.Col>
            <Grid.Col xs={8}>{child}</Grid.Col>
            <Grid.Col xs={4}>{child}</Grid.Col>
            <Grid.Col xs={3}>{child}</Grid.Col>
            <Grid.Col xs={3}>{child}</Grid.Col>
            <Grid.Col xs={6}>{child}</Grid.Col>
          </Grid>
        </Container>
      </Paper>
    </>
  );
};
