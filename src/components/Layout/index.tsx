import { ActionIcon, Paper, Space, Title } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

type Props = {
  children: React.ReactNode;
  title: string;
  backUrl?: string;
};
export const Layout = ({ children, title, backUrl }: Props) => {
  return (
    <div className="flex justify-center pt-10 relative min-h-screen">
      <div className="max-w-2xl w-full z-20 pb-10">
        <Paper shadow="lg" p="md" withBorder>
          <div className="flex items-center">
            {backUrl && (
              <Link to={backUrl} className="mr-2">
                <ActionIcon variant="subtle" aria-label="Settings">
                  <IconArrowBack stroke={1.5} />
                </ActionIcon>
              </Link>
            )}
            <Title order={2}>{title}</Title>
          </div>
          <Space h="md" />
          {children}
        </Paper>
      </div>
      <div className="fixed left-1 bottom-1 text-5xl font-bold text-gray-600">
        OFF-RAMP <br /> PLAYGROUND
      </div>
    </div>
  );
};
