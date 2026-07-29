# Handover — Newsletter signup on /insights

Owner: Raphy Varghese
Status: NOT YET WIRED. Do not enable in production until the four items
in "Blockers" below are cleared.

## Why this note exists

Brief 3 step 7 asked for a newsletter signup on `/insights` and every
article page, wired to Resend, with the copy
"Get the Middle East enterprise hiring brief." Sumeet explicitly
deferred implementation to Raphy — the goal here is to record every
decision I would need to make, plus the copy and Resend contract, so the
implementation is mechanical when the blockers clear.

## Blockers before implementation

1. **Legacy footer copy.** The current yallo.co footer form uses copy
   we haven't ratified. Confirm the exact strings we ship:
   - Heading: "Get the Middle East enterprise hiring brief."
   - Field labels: `Full name`, `Work email`
   - Consent line: (needs legal sign-off — placeholder in code)
   - Success state: "You're on. First brief lands soon." (placeholder)
2. **Resend audience id.** Add `RESEND_AUDIENCE_ID` to Vercel env for
   preview + production. The `RESEND_API_KEY` already exists for the
   `/api/brief` and `/api/cv` routes. If the audience id is absent at
   runtime the signup component must render a disabled state with a
   plain "coming soon" note — never post to an unknown audience.
3. **Frequency claim.** Brief says "no claim about frequency until one
   is agreed." Nail down monthly / fortnightly / ad-hoc with Sumeet and
   surface it under the heading before shipping.
4. **Consent + double opt-in.** Confirm whether we require confirmed
   opt-in (Resend supports single vs double). If double, the form
   posts, receives a "check your inbox" response, and Resend sends the
   confirmation email; if single, we render success immediately.

## Where to wire

- New component: `src/components/blocks/NewsletterSignup.tsx` (server
  component with a client "use client" form island for the fetch/POST).
- Mount on:
  - `src/app/insights/page.tsx` — inside `<section className={styles.bottomCta}>`
    or between the grid and the bottom CTA.
  - `src/app/insights/[slug]/page.tsx` — same slot at the article foot,
    before the "Have a specific brief?" block.
- API route: `src/app/api/newsletter/route.ts` — POST handler that
  validates the payload with Zod (name + email + optional consent
  boolean), then calls Resend contacts.create with the audience id
  from env.
- Env: document `RESEND_AUDIENCE_ID` in `.env.example` (next to
  `RESEND_API_KEY`). Never commit values.

## Resend contract (pseudo)

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.contacts.create({
  audienceId: process.env.RESEND_AUDIENCE_ID!,
  email: parsed.email,
  firstName: parsed.name,
  unsubscribed: false,
});
```

Rate-limit / hCaptcha decision is Raphy's; the existing brief and cv
routes have no rate-limit today, so this needs an owner call.

## Testing checklist

- [ ] `pnpm test` — add an e2e that submits the form and asserts the
      success state renders.
- [ ] Verify Resend delivered the confirmation on preview.
- [ ] Confirm the sign-up appears on `/insights` + one article page.
- [ ] `pnpm build` — no build-time env reads (form logic is client +
      route handler only).

Last touched: 2026-07-29 (content/insights-migration branch).
