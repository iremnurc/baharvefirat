export type CountryCode = {
  code: string;
  iso2: string;
  label: string;
};

export function countryFlag(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

const countries: CountryCode[] = [
  { code: "+90", iso2: "TR", label: "Türkiye" },
  { code: "+1", iso2: "US", label: "ABD" },
  { code: "+1", iso2: "CA", label: "Kanada" },
  { code: "+355", iso2: "AL", label: "Arnavutluk" },
  { code: "+49", iso2: "DE", label: "Almanya" },
  { code: "+54", iso2: "AR", label: "Arjantin" },
  { code: "+61", iso2: "AU", label: "Avustralya" },
  { code: "+43", iso2: "AT", label: "Avusturya" },
  { code: "+994", iso2: "AZ", label: "Azerbaycan" },
  { code: "+973", iso2: "BH", label: "Bahreyn" },
  { code: "+880", iso2: "BD", label: "Bangladeş" },
  { code: "+32", iso2: "BE", label: "Belçika" },
  { code: "+971", iso2: "AE", label: "Birleşik Arap Emirlikleri" },
  { code: "+44", iso2: "GB", label: "Birleşik Krallık" },
  { code: "+387", iso2: "BA", label: "Bosna-Hersek" },
  { code: "+55", iso2: "BR", label: "Brezilya" },
  { code: "+359", iso2: "BG", label: "Bulgaristan" },
  { code: "+213", iso2: "DZ", label: "Cezayir" },
  { code: "+56", iso2: "CL", label: "Şili" },
  { code: "+86", iso2: "CN", label: "Çin" },
  { code: "+420", iso2: "CZ", label: "Çekya" },
  { code: "+45", iso2: "DK", label: "Danimarka" },
  { code: "+62", iso2: "ID", label: "Endonezya" },
  { code: "+374", iso2: "AM", label: "Ermenistan" },
  { code: "+372", iso2: "EE", label: "Estonya" },
  { code: "+212", iso2: "MA", label: "Fas" },
  { code: "+63", iso2: "PH", label: "Filipinler" },
  { code: "+358", iso2: "FI", label: "Finlandiya" },
  { code: "+33", iso2: "FR", label: "Fransa" },
  { code: "+995", iso2: "GE", label: "Gürcistan" },
  { code: "+27", iso2: "ZA", label: "Güney Afrika" },
  { code: "+82", iso2: "KR", label: "Güney Kore" },
  { code: "+385", iso2: "HR", label: "Hırvatistan" },
  { code: "+91", iso2: "IN", label: "Hindistan" },
  { code: "+31", iso2: "NL", label: "Hollanda" },
  { code: "+852", iso2: "HK", label: "Hong Kong" },
  { code: "+964", iso2: "IQ", label: "Irak" },
  { code: "+98", iso2: "IR", label: "İran" },
  { code: "+353", iso2: "IE", label: "İrlanda" },
  { code: "+972", iso2: "IL", label: "İsrail" },
  { code: "+34", iso2: "ES", label: "İspanya" },
  { code: "+46", iso2: "SE", label: "İsveç" },
  { code: "+41", iso2: "CH", label: "İsviçre" },
  { code: "+39", iso2: "IT", label: "İtalya" },
  { code: "+354", iso2: "IS", label: "İzlanda" },
  { code: "+81", iso2: "JP", label: "Japonya" },
  { code: "+7", iso2: "KZ", label: "Kazakistan" },
  { code: "+974", iso2: "QA", label: "Katar" },
  { code: "+357", iso2: "CY", label: "Kıbrıs" },
  { code: "+996", iso2: "KG", label: "Kırgızistan" },
  { code: "+965", iso2: "KW", label: "Kuveyt" },
  { code: "+371", iso2: "LV", label: "Letonya" },
  { code: "+961", iso2: "LB", label: "Lübnan" },
  { code: "+370", iso2: "LT", label: "Litvanya" },
  { code: "+352", iso2: "LU", label: "Lüksemburg" },
  { code: "+36", iso2: "HU", label: "Macaristan" },
  { code: "+60", iso2: "MY", label: "Malezya" },
  { code: "+356", iso2: "MT", label: "Malta" },
  { code: "+52", iso2: "MX", label: "Meksika" },
  { code: "+377", iso2: "MC", label: "Monako" },
  { code: "+976", iso2: "MN", label: "Moğolistan" },
  { code: "+20", iso2: "EG", label: "Mısır" },
  { code: "+389", iso2: "MK", label: "Kuzey Makedonya" },
  { code: "+47", iso2: "NO", label: "Norveç" },
  { code: "+968", iso2: "OM", label: "Umman" },
  { code: "+998", iso2: "UZ", label: "Özbekistan" },
  { code: "+92", iso2: "PK", label: "Pakistan" },
  { code: "+51", iso2: "PE", label: "Peru" },
  { code: "+48", iso2: "PL", label: "Polonya" },
  { code: "+351", iso2: "PT", label: "Portekiz" },
  { code: "+40", iso2: "RO", label: "Romanya" },
  { code: "+7", iso2: "RU", label: "Rusya" },
  { code: "+966", iso2: "SA", label: "Suudi Arabistan" },
  { code: "+381", iso2: "RS", label: "Sırbistan" },
  { code: "+65", iso2: "SG", label: "Singapur" },
  { code: "+421", iso2: "SK", label: "Slovakya" },
  { code: "+386", iso2: "SI", label: "Slovenya" },
  { code: "+963", iso2: "SY", label: "Suriye" },
  { code: "+992", iso2: "TJ", label: "Tacikistan" },
  { code: "+66", iso2: "TH", label: "Tayland" },
  { code: "+886", iso2: "TW", label: "Tayvan" },
  { code: "+216", iso2: "TN", label: "Tunus" },
  { code: "+993", iso2: "TM", label: "Türkmenistan" },
  { code: "+380", iso2: "UA", label: "Ukrayna" },
  { code: "+962", iso2: "JO", label: "Ürdün" },
  { code: "+64", iso2: "NZ", label: "Yeni Zelanda" },
  { code: "+30", iso2: "GR", label: "Yunanistan" },
];

export const countryCodes: CountryCode[] = [
  countries.find((country) => country.iso2 === "TR")!,
  ...countries
    .filter((country) => country.iso2 !== "TR")
    .sort((a, b) => a.label.localeCompare(b.label, "tr")),
];

export const defaultCountryIso = "TR";

export function getCountryByIso(iso2: string): CountryCode | undefined {
  return countryCodes.find((country) => country.iso2 === iso2);
}

export function getCountryByCode(code: string): CountryCode | undefined {
  return countryCodes.find((country) => country.code === code);
}
