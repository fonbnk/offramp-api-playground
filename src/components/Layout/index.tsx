import { Paper } from "@mantine/core";

export const Layout = ({ children }: { children: any }) => {
  return (
    <div className="flex justify-center pt-10">
      <div className="max-w-2xl w-full">
        <Paper shadow="lg" p="md" withBorder>
          {children}
        </Paper>
      </div>
    </div>
  );
};
