import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { CountdownSection } from "@/components/countdown-section";
import { DraggableMarquee } from "@/components/draggable-marquee";
import { RsvpForm } from "@/components/rsvp-form";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const { time, venue, city } = siteConfig.wedding;

  return (
    <PageShell>
      <Section id="date-location" className="pt-56 text-center" revealGroup>
        <h2 className="font-serif text-7xl tracking-wide text-foreground/90 md:text-8xl">
          {siteConfig.wedding.date}
        </h2>
        <p className="mt-4 whitespace-nowrap font-sans text-lg text-foreground/75">
          {venue}, {city}
        </p>
      </Section>

      <section id="story" className="w-full py-32">
        <div
          className="grid gap-10 md:grid-cols-2 md:items-end"
          data-reveal-group
        >
          <div className="relative h-128 w-full overflow-hidden md:h-160">
            <Image
              src="/images/IMG_0892.webp"
              alt="Bahar ve Fırat"
              fill
              quality={90}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="pl-9 pr-9 text-center md:pr-9 md:text-left">
            <h2 className="font-serif text-3xl text-foreground/90 md:text-4xl">
              Her şey bir merhaba ile başladı.
            </h2>
            <p className="mt-4 font-sans text-lg leading-relaxed text-foreground/80">
              Yollarımızın kesiştiği ilk günden bugüne, birlikte
              biriktirdiğimiz anılar bizi bu özel güne taşıdı. Şimdi ise
              hayatımızın en anlamlı &quot;evet&quot;ini sevdiklerimizin
              huzurunda söylemek için gün sayıyoruz.
            </p>
          </div>
        </div>
      </section>

      <CountdownSection />

      <section id="flow" className="w-full py-32">
        <div
          className="flex flex-col gap-12 md:h-160 md:flex-row md:justify-between md:gap-0"
          data-reveal-group
        >
          <div className="flex w-full flex-col gap-10 px-8 text-center md:h-full md:w-[48%] md:justify-between md:pl-9 md:pr-9 md:text-left">
            <div className="flow-details-block flex flex-col gap-6">
              <h2 className="font-serif text-3xl text-foreground/90 md:text-4xl">
                Etkinlik Detayları
              </h2>
              <p className="font-sans text-lg leading-relaxed text-foreground/80">
                Hayatımızın en güzel gününde sizleri de aramızda görmekten
                mutluluk duyarız.
              </p>
              <dl className="grid gap-4 font-sans text-foreground/70 md:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                    Tarih ve Saat
                  </dt>
                  <dd className="mt-2 text-lg">
                    {siteConfig.wedding.date} · {time}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                    Mekan
                  </dt>
                  <dd className="mt-2 text-lg whitespace-nowrap">
                    {venue}, {city}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flow-schedule-block flex flex-col gap-6">
              <h3 className="font-serif text-3xl text-foreground/90 md:text-4xl">
                Günün Akışı
              </h3>
              <div className="space-y-4">
                {[
                  ["16:00", "Misafir Karşılama"],
                  ["16:30", "Nikâh Töreni"],
                  ["17:30", "Kokteyl"],
                  ["19:00", "Akşam Yemeği"],
                  ["20:30", "Eğlence ve Dans"],
                ].map(([hour, label]) => (
                  <div
                    key={hour}
                    className="flex items-center justify-between border-b border-sage-light/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-serif text-xl text-foreground/90">
                      {hour}
                    </p>
                    <p className="font-sans text-base text-foreground/80">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative h-128 w-full overflow-hidden md:h-full md:w-[48%]">
            <Image
              src="/images/IMG_0902.webp"
              alt="Etkinlik atmosferi"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="gallery" className="w-full py-32" data-reveal-group>
        <DraggableMarquee
          images={[
            "/images/IMG_0904.webp",
            "/images/IMG_0912.webp",
            "/images/IMG_0976.webp",
            "/images/IMG_0998.webp",
            "/images/IMG_1033.webp",
            "/images/IMG_1128.webp",
          ]}
        />
      </section>

      <Section id="accommodation" title="Konaklama Bilgileri" className="pt-8 text-center" revealGroup>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          Misafirlerimiz için anlaşmalı otellerde indirimli konaklama
          alternatifleri sunacağız. Otel isimleri, rezervasyon kodları ve
          ulaşım detaylarını çok yakında bu bölümde paylaşacağız.
        </p>
      </Section>

      <section id="rsvp" className="w-full pt-32 pb-12 md:pb-32">
        <div
          className="grid items-center gap-10 md:grid-cols-2"
          data-reveal-group
        >
          <div className="relative h-128 w-full overflow-hidden md:h-160">
            <Image
              src="/images/IMG_1203.webp"
              alt="Bahar ve Fırat RSVP"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-6 px-8 py-6 text-center md:h-160 md:justify-between md:gap-0 md:pb-0 md:pl-9 md:pr-9 md:pt-0 md:text-left">
            <div>
              <h2 className="font-serif text-3xl text-foreground/90 md:text-4xl">
                Bizimle Olacak Mısınız?
              </h2>
              <p className="mt-4 font-sans text-lg leading-relaxed text-foreground/80">
                Bu özel günümüzde sizleri aramızda görmekten mutluluk duyarız.
                Lütfen katılım durumunuzu aşağıdaki form aracılığıyla
                bildiriniz.
              </p>
            </div>
            <div className="min-h-0">
              <RsvpForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-sage-light px-6 py-12 text-center">
        <p className="font-serif text-2xl text-foreground/60 md:text-3xl">
          {siteConfig.couple.bride} & {siteConfig.couple.groom}
        </p>
      </footer>
    </PageShell>
  );
}
