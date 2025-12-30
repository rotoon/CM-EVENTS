import { FooterNeo } from '@/components/footer-neo'
import { NavbarNeo } from '@/components/navbar-neo'
import { TopMarquee } from '@/components/top-marquee'

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
