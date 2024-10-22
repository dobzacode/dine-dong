import SideMenu from '@/components/settings/side-menu';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="section-px section-py inner-section-gap container flex flex-col items-start laptop-sm:max-w-[1100px] laptop-sm:flex-row">
      <SideMenu />
      {children}
    </section>
  );
}
