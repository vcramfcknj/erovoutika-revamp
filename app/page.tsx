import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { About } from '@/components/sections/about'
import { News } from '@/components/sections/news'
import { Awards } from '@/components/sections/awards'
import { IndustryPartners } from '@/components/sections/industry-partners'
import { AcademePartners } from '@/components/sections/academe-partners'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>
      <section id="news">
        <News />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="awards">
        <Awards />
      </section>
      <section id="industry-partners">
        <IndustryPartners />
      </section>
      <section id="academe-partners">
        <AcademePartners />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  )
}