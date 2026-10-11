export function whatsappConfig() {
  const apiKey = process.env.CALLMEBOT_API_KEY?.trim();
  const phone = process.env.WHATSAPP_TO?.trim();
  if (!apiKey || !phone || !/^\+[1-9]\d{7,14}$/.test(phone)) return null;
  return { apiKey, phone };
}

export function whatsappRequestUrl(text: string) {
  const config = whatsappConfig();
  if (!config) return null;
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", config.phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", config.apiKey);
  return url;
}

export async function sendWhatsApp(text: string) {
  const url = whatsappRequestUrl(text);
  if (!url) return "skipped" as const;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error("whatsapp_unreachable");
  }
  const body = await response.text().catch(() => "");
  if (!response.ok || !/message queued/i.test(body))
    throw new Error("whatsapp_not_queued");
  return "sent" as const;
}

export async function sendOwnerAlert(text: string) {
  if (!whatsappConfig()) return;
  try {
    await sendWhatsApp(text);
  } catch {
    // The website action already succeeded. A missed text can be retried by the visitor's next action.
  }
}
