import { emailDomain, errorFields, log } from "./log";

// Envoi d'e-mails par l'API de Resend. Sans RESEND_API_KEY (développement),
// le message est écrit dans la console du serveur, liens compris.
// Chaque appel est coupé au bout de 8 s, et retenté deux fois avec un délai
// croissant si Resend est indisponible (erreur réseau ou 5xx).

export type Email = { to: string; subject: string; text: string; html: string };

const RETRIES = [500, 1500];

export async function sendEmail(email: Email): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Terminal Arcade <noreply@localhost>";
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY manquant : envoi d'e-mail impossible.");
    console.log(`\n--- e-mail (développement) ---\nÀ : ${email.to}\nObjet : ${email.subject}\n\n${email.text}\n------------------------------\n`);
    return;
  }
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [email.to], subject: email.subject, text: email.text, html: email.html }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        log("info", "email.sent", { domain: emailDomain(email.to), subject: email.subject });
        return;
      }
      // Erreur de notre fait (4xx) : inutile de réessayer.
      if (res.status < 500) throw new Error(`Resend a refusé l'e-mail (${res.status}) : ${(await res.text()).slice(0, 200)}`);
      throw new RetryableError(`Resend indisponible (${res.status})`);
    } catch (error) {
      const retryable = error instanceof RetryableError || (error instanceof Error && error.name !== "Error");
      if (!retryable || attempt >= RETRIES.length) {
        log("error", "email.failed", { domain: emailDomain(email.to), ...errorFields(error) });
        throw error;
      }
      await new Promise((r) => setTimeout(r, RETRIES[attempt]));
    }
  }
}

class RetryableError extends Error {
  name = "RetryableError";
}

/** Gabarit commun : texte brut et HTML minimal, sans image ni pisteur. */
export function layout(title: string, paragraphs: string[], action?: { label: string; url: string }): { text: string; html: string } {
  const text = [title, "", ...paragraphs, ...(action ? ["", `${action.label} : ${action.url}`] : []), "", "— Terminal Arcade"].join("\n");
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:auto;color:#111">
<h1 style="font-size:20px">${esc(title)}</h1>
${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n")}
${action ? `<p><a href="${esc(action.url)}" style="display:inline-block;background:#d4f54a;color:#0a0a0a;padding:10px 18px;text-decoration:none;font-weight:bold">${esc(action.label)}</a></p>` : ""}
<p style="color:#666;font-size:12px">Terminal Arcade</p></div>`;
  return { text, html };
}
