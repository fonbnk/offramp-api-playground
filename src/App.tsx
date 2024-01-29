// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <div className="p-10 text-2xl">hi</div>
    </MantineProvider>
  );
}
