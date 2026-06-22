import { getIcsContent } from "@/lib/calendar";

export function GET() {
  return new Response(getIcsContent(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=bahar-firat-dugun.ics",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
