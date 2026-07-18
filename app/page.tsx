import { Hero } from '@/components/sections/Hero';
import { Return } from '@/components/sections/Return';
import { Speedup } from '@/components/sections/Speedup';
import { SproutFundSection } from '@/components/sections/SproutFund';
import { Skills } from '@/components/sections/Skills';
import { Leadership } from '@/components/sections/Leadership';
import { Contact } from '@/components/sections/Contact';
import { DecorField } from '@/components/PixelDecor';
import s from './page.module.css';

export default function Page() {
  return (
    <>
      <Hero />
      <div className={s.body}>
        <DecorField />
        <main>
          <Return />
          <Speedup />
          <SproutFundSection />
          <Skills />
          <Leadership />
        </main>
      </div>
      <Contact />
    </>
  );
}
