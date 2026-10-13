import { afterEach, describe, expect, it, vi } from "vitest";
import { emailConfigured, sendEmail } from "./email";

const KEYS = ["RESEND_API_KEY", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;
const mail = { to: "ada@example.com", subject: "Test", text: "Bonjour", html: "<p>Bonjour</p>" };

afterEach(() => {
  for (const k of KEYS) delete process.env[k];
  vi.unstubAllEnvs();
});

describe("e-mails", () => {
  it("reconnaît Resend ou un SMTP complet", () => {
    expect(emailConfigured({})).toBe(false);
    expect(emailConfigured({ RESEND_API_KEY: "re_x" })).toBe(true);
    expect(emailConfigured({ SMTP_HOST: "smtp.gmail.com", SMTP_USER: "a@gmail.com" })).toBe(false);
    expect(emailConfigured({ SMTP_HOST: "smtp.gmail.com", SMTP_USER: "a@gmail.com", SMTP_PASS: "abcd" })).toBe(true);
  });

  it("refuse d'envoyer en production sans service configuré", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(sendEmail(mail)).rejects.toThrow(/Aucun service d'e-mail/);
  });

  it("passe par SMTP quand il est configuré, et réessaie s'il ne répond pas", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    Object.assign(process.env, { SMTP_HOST: "127.0.0.1", SMTP_PORT: "1", SMTP_USER: "a@example.com", SMTP_PASS: "x" });
    await expect(sendEmail(mail)).rejects.toThrow(/Serveur SMTP indisponible/);
  }, 20_000);
});
