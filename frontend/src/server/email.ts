import { emailDomain, errorFields, log } from "./log";

// Envoi d'e-mails, par le premier service configuré :
//   1. Resend (RESEND_API_KEY) : demande un domaine vérifié ;
//   2. SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT) : par exemple Gmail
//      avec un mot de passe d'application, sans domaine ;
//   3. aucun : en développement, le message est écrit dans la console du
//      serveur, liens compris ; en production, l'envoi échoue.
// Chaque envoi est coupé au bout de 8 à 10 s, et retenté deux fois avec un
// délai croissant si le service est indisponible.

export type Email = { to: string; subject: string; text: string; html: string };

const RETRIES = [500, 1500];

/** Un service d'envoi est-il configuré ? */
export function emailConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.RESEND_API_KEY?.trim() || smtpConfigured(env));
}

function smtpConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim());
}

export async function sendEmail(email: Email): Promise<void> {
  const env = process.env;
  const send = env.RESEND_API_KEY?.trim() ? sendWithResend : smtpConfigured(env) ? sendWithSmtp : null;
  if (!send) {
    if (env.NODE_ENV === "production") throw new Error("Aucun service d'e-mail configuré (RESEND_API_KEY ou SMTP_…).");
    console.log(`\n--- e-mail (développement) ---\nÀ : ${email.to}\nObjet : ${email.subject}\n\n${email.text}\n------------------------------\n`);
    return;
  }
  for (let attempt = 0; ; attempt++) {
    try {
      await send(email);
      log("info", "email.sent", { domain: emailDomain(email.to), subject: email.subject });
      return;
    } catch (error) {
      if (!(error instanceof RetryableError) || attempt >= RETRIES.length) {
        log("error", "email.failed", { domain: emailDomain(email.to), ...errorFields(error) });
        throw error;
      }
      await new Promise((r) => setTimeout(r, RETRIES[attempt]));
    }
  }
}

async function sendWithResend(email: Email): Promise<void> {
  const from = process.env.EMAIL_FROM ?? "Terminal Arcade <noreply@localhost>";
  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [email.to], subject: email.subject, text: email.text, html: email.html }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    // Réseau coupé ou délai dépassé : on réessaie.
    throw new RetryableError("Resend injoignable", { cause: error });
  }
  if (res.ok) return;
  // Erreur de notre fait (4xx) : inutile de réessayer.
  if (res.status < 500) throw new Error(`Resend a refusé l'e-mail (${res.status}) : ${(await res.text()).slice(0, 200)}`);
  throw new RetryableError(`Resend indisponible (${res.status})`);
}

async function sendWithSmtp(email: Email): Promise<void> {
  const { createTransport } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER!;
  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 : TLS dès la connexion ; 587 : STARTTLS obligatoire.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM?.trim() || `Terminal Arcade <${user}>`,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (error) {
    // Identifiants refusés (535) ou adresse rejetée (5xx) : inutile de réessayer.
    const code = (error as { responseCode?: number }).responseCode;
    if (code && code >= 500) throw new Error(`Le serveur SMTP a refusé l'e-mail (${code})`, { cause: error });
    throw new RetryableError("Serveur SMTP indisponible", { cause: error });
  } finally {
    transport.close();
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

/** Service d'envoi, tel qu'il est nommé dans les pages légales. */
export function emailProvider(env: Record<string, string | undefined> = process.env): { name: string; where: string } {
  if (env.RESEND_API_KEY?.trim()) return { name: "Resend (Plus Five Five, Inc.)", where: "États-Unis" };
  const host = env.SMTP_HOST?.trim() ?? "";
  if (/(^|\.)(gmail|googlemail)\.com$/i.test(host)) return { name: "Gmail (Google LLC)", where: "États-Unis" };
  if (host) return { name: `serveur SMTP ${host}`, where: "hors du Bénin" };
  return { name: "Resend (Plus Five Five, Inc.)", where: "États-Unis" };
}
