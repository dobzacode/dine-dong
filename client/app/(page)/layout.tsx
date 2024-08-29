import Header from '@/components/ui/header/header';
import { Toaster } from '@/components/ui/toaster';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <FramerMotionWrapper> */}
      <Header />
      <main className="background flex min-h-screen flex-col items-center justify-center gap-xl py-md">
        {children}
      </main>
      <Toaster />
      {/* </FramerMotionWrapper> */}
    </>
  );
}
