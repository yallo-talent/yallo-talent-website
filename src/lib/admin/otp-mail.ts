import "server-only";
import { Resend } from "resend";
import { CODE_TTL_MS } from "@/lib/admin/otp";
import { authEmailFrom } from "@/lib/mail-config";

/**
 * The sign-in code's delivery.
 *
 * WHY IT IS ITS OWN MODULE rather than a branch inside the two API routes that
 * already send mail: those are lead notifications, sent to Yallo, about somebody
 * else. This is sent TO a colleague and is the only thing standing between them
 * and the cockpit. The failure modes differ, the sender differs (R-28a.5), and
 * the one thing they must never share is a code path where a change made for a
 * lead email alters what a credential email does.
 *
 * NO CODE IS EVER LOGGED. The only place the plaintext exists is the argument to
 * this function and the body it builds. A failure is reported by its Resend
 * error, never by echoing what was being sent.
 */

const MINUTES = Math.round(CODE_TTL_MS / 60000);

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendSignInCode(
  to: string,
  name: string,
  code: string,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    /* Named, not silent. §2.6: a cockpit that cannot send is a cockpit only the
       break-glass can enter, and the operator needs to know which of those two
       situations they are in. */
    console.error(
      "[admin-otp] RESEND_API_KEY not set: no sign-in code was delivered. Database accounts cannot sign in; the ADMIN_EMAIL break-glass is unaffected.",
    );
    return { ok: false, reason: "RESEND_API_KEY not set" };
  }

  const from = authEmailFrom();
  const firstName = name.trim().split(/\s+/)[0] || "there";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `Your Yallo admin sign-in code: ${code}`,
      /* The code is in the subject as well as the body on purpose: it is the
         one thing the reader needs, and a notification preview that shows it
         saves opening the message on a phone. It is not a secret at rest, which
         is the whole property that makes R-28a.1 safe where round 23 §7 was
         not: it expires in ten minutes and is single use. */
      text: [
        `Hello ${firstName},`,
        "",
        `Your sign-in code is ${code}`,
        "",
        `It expires in ${MINUTES} minutes and can be used once.`,
        "",
        "If you did not ask to sign in, you can ignore this message. Nobody can use this code without it, and it stops working on its own.",
        "",
        "Yallo Talent",
      ].join("\n"),
    });

    if (error) {
      console.error(
        `[admin-otp] Resend refused the sign-in code from ${from}: ${error.message}`,
      );
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error(
      `[admin-otp] sending the sign-in code from ${from} threw: ${err instanceof Error ? err.message : "unknown error"}`,
    );
    return { ok: false, reason: "send failed" };
  }
}
