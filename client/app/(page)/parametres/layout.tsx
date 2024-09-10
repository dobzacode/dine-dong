import SideMenu from '@/components/settings/side-menu';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="section-px section-py max-laptop-sm:inner-section-gap container flex flex-col items-start laptop-sm:max-w-[1200px] laptop-sm:flex-row laptop-sm:gap-sm">
      <SideMenu />
      {children}
    </section>
  );
}
