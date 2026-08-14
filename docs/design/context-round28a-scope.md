# Context — round 28a scope: OTP cockpit sign-in, and two jobs follow-ons

**v1.0 · 14 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`, then `DESIGN.md`,
then the standing rules, then this file. Lower never overrides higher.
Ratified by Sumeet, 14 August 2026. None of §1 reopens.

---

## 1. Rulings

**R-28a.1 — Database accounts sign in with an emailed one-time code, not a
password.** Ratified by Sumeet, 14 Aug 2026. This supersedes round 23 §7, which
ruled that a generated password is displayed once on screen and never emailed.

The reasoning that produced round 23 §7 is not being contradicted. It held that
a plaintext password must never travel by email, and that remains absolute. What
changes is that there is no longer a password to travel. A one-time code is not a
credential at rest: it expires, it is single-use, and holding it later grants
nothing.

The failure that forced this: four accounts were created on 13 Aug 2026 for real
colleagues. The one-time passwords were shown once, were not captured, and all
four people are locked out of a cockpit they need for daily work. A credential
flow whose only recovery path is "generate another one and read it off a screen
again" is a flow that fails exactly when a person needs it. It should not have
shipped this way and this round corrects it rather than patching it.

**R-28a.2 — The environment break-glass pair does not change, at all.** Ratified.
`ADMIN_EMAIL` plus `ADMIN_PASSWORD_HASH` continue to sign in, continue to map to
`owner`, and continue to be checked only when no table row matches the address.
`src/lib/admin/auth.ts` already names this the rule that must never regress, and
this round strengthens the reason rather than weakening it: once sign-in for
database accounts depends on an email being delivered, a Resend outage or an
unverified sender is a total lockout of the live cockpit. The break-glass is the
one door that must never depend on a third party. It stays a password path
precisely because it must work when nothing else does.

**R-28a.3 — Sessions last fifteen days only when the person asks.** Ratified.
The sign-in form carries a checkbox, labelled "Keep me signed in for 15 days".
Unchecked, the session gets a short window. Checked, fifteen days.

**R-28a.4 — A fifteen-day session forces a live disabled check.** Ratified, and
this is the second-order effect of R-28a.3 rather than a separate feature.
`auth.ts` currently argues, correctly for its time, that disabling is the urgent
case and is unaffected because a disabled account cannot sign in again. A
fifteen-day session breaks that argument: a person disabled on day one keeps a
working session until day fifteen. The session callback therefore checks the
account's `disabled` state, and one indexed lookup per admin request is the
accepted cost. Role changes may still lag until the session is next issued; that
part of the existing reasoning stands.

**R-28a.5 — The sender is `auth@yallo.co`.** Ratified. Environment variable with
that address as its default. It is a separate sender from the briefs transactional
path on purpose: a credential-adjacent message and a lead notification should not
share a reputation or a mailbox.

**None of §1 reopens.** Do not relitigate the supersession of round 23 §7, the
break-glass, the fifteen-day option, or the sender address.

---

## 2. The OTP design

### 2.1 What the person experiences

1. They go to `/admin`, are sent to the sign-in page, and type their email
   address. No password field for a database account.
2. They receive an email from `auth@yallo.co` with a six-digit code.
3. They type the code and, if they want, tick "Keep me signed in for 15 days".
4. They are signed in. Nothing was ever generated for them by an administrator,
   and nothing needed to be handed over.

Creating an account therefore requires no email to be sent at that moment. The
administrator creates the row and tells the person the address is live. This is
why the whole account-creation email problem disappears rather than being solved.

### 2.2 The code, and the rules it must satisfy

- **Six digits, numeric.** Short enough to retype from a phone. Its safety comes
  from expiry and an attempt cap, not from length.
- **Stored hashed, never in plaintext.** Reuse `hashPassword` / `verifyPassword`
  from `src/lib/admin/password.ts` rather than introducing a second primitive.
  A readable code column is a readable credential for its lifetime, and the
  `dev-raphy` branch is a full copy of production data on a second machine.
- **Ten-minute expiry.**
- **Single use.** Marked consumed, never deleted. Round 17 §3's no-second-delete-
  path rule holds: consumption is a state change, and a sweep of consumed rows
  extends an existing purge rather than adding one.
- **Five attempts, then the code is dead.** A six-digit code with unlimited
  attempts is a million guesses against one target and is not a credential. The
  attempt counter lives on the row, not in memory, or it resets on every deploy.
- **Requesting a new code invalidates the previous one** for that address. Two
  live codes doubles the guessing surface for no benefit.
- **A request rate limit per address.** A floor rather than a ceiling: enough to
  stop an inbox being used as a mail bomb. Choose the window, state it in the
  relay, and make it observable rather than silent.

### 2.3 What the response must never reveal

The sign-in surface is public and unauthenticated. It must respond identically
whether or not an address has an account, and whether or not that account is
disabled. Same wording, same status, same shape.

A code is sent only when a row exists and is not disabled. Everything else
proceeds as if it had been. This is not politeness: a form that answers "no such
account" differently is a free list of who works here, and the addresses are
`firstname.lastname@yallo.co`, so the list is guessable and the confirmation is
the only missing piece.

Failure messages on the code step are generic for the same reason. Wrong code,
expired code, consumed code and too many attempts all read the same to the
caller. Distinguishing them tells an attacker which of their guesses was close
to a real state.

The one exception, and it is not an exception to the rule above: a message about
what the person just typed can be specific. "Enter all six digits" is about the
input, not about the account.

### 2.4 What happens to passwords on database accounts

`users.password_hash` is `NOT NULL`, so a row must carry a hash. Nothing signs in
with it once this ships, and the Users pane must stop displaying, generating for
display, or reporting any credential at all.

**Bounded delegation, and this is the one place to measure before deciding.**
`check:editor` and `check:admin-render` sign in as part of the gate suite. If a
gate signs in as a database row using a password, removing the password path for
database rows breaks a gate, and a gate is never weakened, skipped or deleted to
make a feature fit. Measure how each admin gate authenticates, then take the
narrowest option that keeps every gate green and report which you took:

- If the gates use only the environment pair, the password path for database rows
  goes, and `resetPasswordAction` goes with it.
- If a gate signs in as a database row, retain the password path for database
  rows alongside OTP and say so plainly in the relay, with a recommendation for
  how to remove it later.

Do not invent a test-only bypass, an environment flag that disables OTP, or a
provider that behaves differently in CI. A door that exists for tests is a door.

### 2.5 Session mechanics

`auth.ts` runs a JWT session. Auth.js configures `maxAge` statically, so a
per-sign-in duration is not a native feature. **[inferred, verify against the
installed version before building]** the workable shape is a single long
`maxAge` of fifteen days with the chosen window carried as a claim on the token,
and the session callback refusing a token whose short window has passed.

Whatever the mechanism, three properties are required and are the acceptance
criteria:

1. An unchecked sign-in does not survive past its short window.
2. A checked sign-in survives fifteen days.
3. A disabled account's existing session stops working, per R-28a.4.

If the installed Auth.js cannot express per-sign-in duration without a database
session strategy, do not migrate the session strategy in this round. Report the
finding, ship the fifteen-day option as the checked case and the library default
as the unchecked case, and name what a correct fix would need.

### 2.6 Configuration, and failing loudly

`adminConfigStatus()` already reports missing variables by name on the sign-in
page, which is the right pattern and the reason a malformed hash was caught once
before. Extend it: the new sender variable and the Resend key are now sign-in
dependencies for database accounts, and a cockpit that cannot send is a cockpit
only the break-glass can enter. The page must say which variable is missing, by
name, and must say that the break-glass path is unaffected.

Never throw at module load. The existing reasoning holds: a missing variable
fails the sign-in, not the build, because `next build` imports this module in
environments that legitimately have no admin secrets.

### 2.7 The prerequisite that is not code

`auth@yallo.co` must be a verified sender in Resend before this reaches
production. It is not, as far as this file knows. Sumeet owns that step. If it
is unverified at merge, every database account is locked out and only the
break-glass works, which is a worse position than today. State this in the
relay as a merge condition rather than assuming it.

---

## 3. The two jobs follow-ons

Both come from relay v38a. Neither is new work; both were correctly ruled out of
round 27.1's territory.

### 3.1 The research PDF fingerprint tracks the site navigation

`check:research-pdf` is red on `fix/jobs-external-tab`. Measured in v38a:
manifest `textLength` 18565 against 18567 rendered, the delta being exactly the
two `↗` characters round 27.1 added to the nav and footer. The cause is that
`/intelligence/research/corridor/print` sits inside the `(site)` route group and
therefore renders the full header and footer, and the manifest fingerprints the
whole text of the print surface.

**Ruled: scope the fingerprint to the research document, not to the page it
renders inside.** Neither of the two options v38a offered. Regenerating the PDF
treats a wrong measurement as a content change and leaves every future navigation
or footer edit failing a gate about a research asset whose body did not move.
The gate's own message says every figure on the site now disagrees with the asset
a stranger gave an email address for, and that is not what happened.

One thing to check first, because it changes what else is wrong rather than the
ruling: **does the shipped PDF contain the navigation and footer text, or does
print CSS hide them while the fingerprint still counts them?** If the PDF carries
site chrome, that is a defect in a gated lead asset and the print surface needs
fixing as well. If it does not, this is purely a gate measuring the wrong
surface. Report which.

Regenerate the manifest once the fingerprint is correctly scoped, so the gate
returns to exit 0 on a true comparison rather than on a refreshed baseline.

### 3.2 The homepage punchout still opens in the same tab

`src/components/blocks/home/Close.tsx` renders `next/link` to
`closeCopy.jobsCta.href` from `src/data/home/intelligence.ts:140`. Measured in
v38a on the live homepage: `target=""`, no `aria-label`, no external mark. It is
the only same-tab `/jobs` anchor left on the estate and it sits on the
highest-traffic page.

**Ruled: `Close.tsx` reads `jobSeekersLink.anchorProps` like the other three
consumers.** The href leaves `src/data/home/intelligence.ts`; the label stays
there. A fourth copy of an address is the hand-copied class this repo lints for,
and v38a proved the point when the footer turned out to hold its own literal.

---

## 4. Forbidden

- No new colour, font or design token. Reuse the existing admin classes.
- No new npm dependency. Auth.js, Resend and the existing helpers cover this.
- No plaintext code, password or token in a log line, an error message, a commit
  message, a screenshot or a relay.
- No invented person, client, metric, quotation, source or date.
- No test-only authentication bypass, no CI-only provider, no environment flag
  that turns OTP off.
- No change to the break-glass pair's behaviour, role mapping or check order.
- No weakening, skipping or deletion of any gate to make this feature fit.
- No migration run against any database from a session. Write the file only.
- No `src/app/(site)/jobs/page.tsx` change. That collision is Sumeet's open
  ruling, recorded in v38a §4, and is not in this round.
- No em dashes. UK English. Banned vocabulary per canon.

---

## 5. Held by Sumeet, not delegated

1. Verifying `auth@yallo.co` in Resend.
2. The `/jobs` route collision: whether the built Job Seekers page is retired or
   moves to its own address. Recorded in v38a §4(d). Not this round.
3. Whether the short session window is hours or a browser session. State the
   value you chose and why; he may overrule it.
