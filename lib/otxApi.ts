// Alienvault OTX (Open Threat Exchange) API client
export async function fetchOTXIP({ ip, apiKey }: { ip: string; apiKey: string }) {
  const url = `https://otx.alienvault.com/api/v1/indicators/IPv4/${encodeURIComponent(ip)}/general`;
  const headers: Record<string, string> = {
    "X-OTX-API-KEY": apiKey,
    "Content-Type": "application/json"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("OTX API error: " + res.statusText);
  return await res.json();
}

export async function fetchOTXDomain({ domain, apiKey }: { domain: string; apiKey: string }) {
  const url = `https://otx.alienvault.com/api/v1/indicators/domain/${encodeURIComponent(domain)}/general`;
  const headers: Record<string, string> = {
    "X-OTX-API-KEY": apiKey,
    "Content-Type": "application/json"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("OTX API error: " + res.statusText);
  return await res.json();
}

export async function fetchOTXPulses({ apiKey, limit = 20 }: { apiKey: string; limit?: number }) {
  const url = `https://otx.alienvault.com/api/v1/pulses/subscribed?limit=${limit}`;
  const headers: Record<string, string> = {
    "X-OTX-API-KEY": apiKey,
    "Content-Type": "application/json"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("OTX API error: " + res.statusText);
  return await res.json();
}

export async function fetchOTXMalware({ hash, apiKey }: { hash: string; apiKey: string }) {
  const url = `https://otx.alienvault.com/api/v1/indicators/file/${encodeURIComponent(hash)}/general`;
  const headers: Record<string, string> = {
    "X-OTX-API-KEY": apiKey,
    "Content-Type": "application/json"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("OTX API error: " + res.statusText);
  return await res.json();
}