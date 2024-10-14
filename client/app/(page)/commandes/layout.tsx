import SideMenu from '@/components/orders/side-menu';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session?.user.sub) {
    redirect('/');
  }

  return (
    <section className="section-px section-py max-laptop-sm:inner-section-gap container flex flex-col items-start laptop-sm:max-w-[1200px] laptop-sm:flex-row laptop-sm:gap-3xl">
      <SideMenu />
      {children}
    </section>
  );
}
