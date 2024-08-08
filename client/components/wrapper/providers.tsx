import { UserProvider } from '@auth0/nextjs-auth0/client';
import QueryProvider from './query-provider';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <UserProvider>{children}</UserProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
