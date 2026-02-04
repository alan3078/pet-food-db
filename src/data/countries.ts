export const countries = [
  { code: "TW", name: "台灣 (Taiwan)" },
  { code: "JP", name: "日本 (Japan)" },
  { code: "US", name: "美國 (USA)" },
  { code: "CA", name: "加拿大 (Canada)" },
  { code: "NZ", name: "紐西蘭 (New Zealand)" },
  { code: "AU", name: "澳洲 (Australia)" },
  { code: "CN", name: "中國 (China)" },
  { code: "HK", name: "香港 (Hong Kong)" },
  { code: "KR", name: "韓國 (South Korea)" },
  { code: "TH", name: "泰國 (Thailand)" },
  { code: "VN", name: "越南 (Vietnam)" },
  { code: "DE", name: "德國 (Germany)" },
  { code: "FR", name: "法國 (France)" },
  { code: "UK", name: "英國 (United Kingdom)" },
  { code: "IT", name: "義大利 (Italy)" },
  { code: "ES", name: "西班牙 (Spain)" },
  { code: "NL", name: "荷蘭 (Netherlands)" },
  { code: "BR", name: "巴西 (Brazil)" },
  { code: "MX", name: "墨西哥 (Mexico)" },
] as const;

export type CountryCode = typeof countries[number]["code"];

export const getCountryName = (code: string) => {
  return countries.find((c) => c.code === code)?.name || code;
};
