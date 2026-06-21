import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const { time, venue, city } = siteConfig.wedding;

  return (
    <main>
      <Hero />

      <Section id="details" title="Tarihi Not Edin">
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          Hayatımızın en güzel gününde sizleri de aramızda görmekten mutluluk
          duyarız.
        </p>
        <dl className="mt-8 space-y-4 font-sans text-foreground/70">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-accent">
              Tarih ve Saat
            </dt>
            <dd className="mt-1 text-lg">
              {siteConfig.wedding.date} · {time}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-accent">
              Mekan
            </dt>
            <dd className="mt-1 text-lg">
              {venue}
              <br />
              {city}
            </dd>
          </div>
        </dl>
      </Section>

      <Section id="rsvp" title="Katılım">
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          Katılım bildirimi detayları yakında eklenecek.
        </p>
      </Section>

      <footer className="border-t border-accent/20 px-6 py-12 text-center">
        <p className="font-serif text-lg text-foreground/60">
          {siteConfig.couple.bride} & {siteConfig.couple.groom}
        </p>
      </footer>
    </main>
  );
}
