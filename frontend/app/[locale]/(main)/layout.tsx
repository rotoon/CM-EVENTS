import { FooterNeo } from '@/components/layout/footer-neo'
import { NavbarNeo } from '@/components/layout/navbar-neo'
import { TopMarquee } from '@/components/layout/top-marquee'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopMarquee />
      <NavbarNeo />
      {children}
      <FooterNeo />
    </>
  )
}
