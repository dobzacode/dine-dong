import Header from '@/components/ui/header/header';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <FramerMotionWrapper> */}
      <Header />
      <main className="background flex min-h-screen items-start justify-center gap-xl py-lg pt-3xl">
        {children}
      </main>
      {/* </FramerMotionWrapper> */}
    </>
  );
}
