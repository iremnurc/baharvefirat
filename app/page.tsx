import { PageShell } from "@/components/page-shell";
import { RsvpForm } from "@/components/rsvp-form";
import { AddToCalendarButton } from "@/components/add-to-calendar-button";
import { SecondaryButton } from "@/components/secondary-button";
import { getGoogleCalendarUrl } from "@/lib/calendar";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const { date, time, venue, city, mapsUrl } = siteConfig.wedding;

  const detailValueClassName =
    "font-serif text-2xl text-foreground/90 md:text-3xl";

  return (
    <PageShell>
      <section id="details" className="w-full px-6 pt-24 md:pt-32">
        <div
          className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 text-center"
          data-reveal-group
          data-stagger="120"
        >
          <h2 className="font-serif text-3xl text-foreground/90 md:text-4xl">
            Etkinlik Detayları
          </h2>

          <div
            className="grid w-full gap-10 md:grid-cols-2 md:gap-8"
            data-reveal-group-nested
            data-stagger="100"
          >
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                Tarih ve Saat
              </p>
              <p className={detailValueClassName}>
                {date} · {time}
              </p>
              <AddToCalendarButton
                googleUrl={getGoogleCalendarUrl()}
                icsUrl="/api/calendar"
                className="justify-center"
              >
                Takvime Ekleyin
              </AddToCalendarButton>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                Mekan
              </p>
              <p className={detailValueClassName}>
                {venue}, {city}
              </p>
              <SecondaryButton href={mapsUrl} external className="justify-center">
                Yol Tarifi Alın
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      <section id="rsvp" className="w-full px-6 pb-24 pt-28 md:pb-32 md:pt-36">
        <div
          className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center"
          data-reveal-group
          data-stagger="120"
        >
          <div>
            <h2 className="font-serif text-3xl text-foreground/90 md:text-4xl">
              Katılım Durumunuzu Bildirin
            </h2>
            <p className="mt-4 font-sans text-lg leading-relaxed text-foreground/80">
              Bu özel günümüzde sizleri aramızda görmekten mutluluk duyarız.
              Lütfen katılım durumunuzu aşağıdaki form aracılığıyla
              bildiriniz.
            </p>
          </div>
          <RsvpForm />
        </div>
      </section>
    </PageShell>
  );
}
