import SideMenu from '@/components/settings/side-menu';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="section-px section-py container flex flex-row items-start gap-sm">
      <SideMenu />
      {children}
    </section>
  );
}
