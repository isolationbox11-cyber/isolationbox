// Legacy API keys file - migrated to use environment variables
// This file is kept for backward compatibility
// New code should use /lib/api-config.ts instead

export const API_KEYS = {
  greynoise: process.env.NEXT_PUBLIC_GREYNOISE_API_KEY || "",
  shodan: process.env.NEXT_PUBLIC_SHODAN_API_KEY || "",
  alienvault_otx: process.env.NEXT_PUBLIC_ALIENVAULT_OTX_API_KEY || "",
  abuseipdb: [
    process.env.NEXT_PUBLIC_ABUSEIPDB_API_KEY || "",
    process.env.NEXT_PUBLIC_ABUSEIPDB_API_KEY_2 || ""
  ].filter(Boolean),
  virustotal: process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY || ""
};
