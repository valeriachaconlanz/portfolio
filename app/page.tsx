import { Hero } from '@/components/sections/Hero';
import { Return } from '@/components/sections/Return';
import { Speedup } from '@/components/sections/Speedup';
import { SproutFundSection } from '@/components/sections/SproutFund';
import { Skills } from '@/components/sections/Skills';

export default function Page() {
  return (
    <main>
      <Hero />
      <Return />
      <Speedup />
      <SproutFundSection />
      <Skills />
    </main>
  );
}
