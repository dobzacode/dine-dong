import SideMenu from '@/components/settings/side-menu';
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
    <section className="section-px section-py inner-section-gap container flex flex-col items-start laptop-sm:max-w-[1100px] laptop-sm:flex-row">
      <SideMenu />
      {children}
    </section>
  );
}
