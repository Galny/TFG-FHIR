export const languageTranslations = {
  "ar": "Árabe",
  "bg": "Búlgaro",
  "bn": "Bengalí",
  "cs": "Checo",
  "bs": "Bosnio",
  "da": "Danés",
  "de": "Alemán",
  "de-AT": "Alemán (Austria)",
  "de-CH": "Alemán (Suiza)",
  "de-DE": "Alemán (Alemania)",
  "el": "Griego",
  "en": "Inglés",
  "en-AU": "Inglés (Australia)",
  "en-CA": "Inglés (Canadá)",
  "en-GB": "Inglés (Reino Unido)",
  "en-IN": "Inglés (India)",
  "en-NZ": "Inglés (Nueva Zelanda)",
  "en-SG": "Inglés (Singapur)",
  "en-US": "Inglés (Estados Unidos)",
  "en-ZA": "Inglés (Sudáfrica)",
  "es": "Español",
  "es-AR": "Español (Argentina)",
  "es-ES": "Español (España)",
  "es-UY": "Español (Uruguay)",
  "es-MX": "Español (México)",
  "et": "Estonio",
  "fi": "Finlandés",
  "fr": "Francés",
  "fr-BE": "Francés (Bélgica)",
  "fr-CH": "Francés (Suiza)",
  "fr-FR": "Francés (Francia)",
  "fr-CA": "Francés (Canadá)",
  "fy": "Frisón",
  "fy-NL": "Frisón (Países Bajos)",
  "hi": "Hindi",
  "hr": "Croata",
  "hr-HR": "Croata (Croacia)",
  "is": "Islandés",
  "is-IS": "Islandés (Islandia)", 
  "it": "Italiano", 
  "it-CH": "Italiano (Suiza)", 
  "it-IT": "Italiano (Italia)", 
  "ja": "Japonés", 
  "ko": "Coreano", 
  "lt": "Lituano", 
  "lv": "Letón", 
  "nl": "Neerlandés", 
  "nl-BE": "Neerlandés (Bélgica)", 
  "nl-NL": "Neerlandés (Países Bajos)", 
  "no": "Noruego", 
  "pa": "Panyabí", 
  "pl": "Polaco", 
  "pt": "Portugués", 
  "pt-PT": "Portugués (Portugal)", 
  "pt-BR": "Portugués (Brasil)", 
  "ro": "Rumano", 
  "ru": "Ruso", 
  "sk": "Eslovaco", 
  "sl": "Esloveno", 
  "sr": "Serbio", 
  "sv": "Sueco", 
  "te": "Télugu", 
  "zh": "Chino", 
  "zh-CN": "Chino (China)", 
  "zh-HK": "Chino (Hong Kong)", 
  "zh-SG": "Chino (Singapur)", 
  "zh-TW": "Chino (Taiwán)"
};

export function normalizeLanguage(lang) {
  if (!lang) return "Desconocido";

  let languageCode = "";

  if (typeof lang === "object" && lang.coding && lang.coding[0]?.code) {
    languageCode = lang.coding[0].code;  // extraemos el code del primer coding
  } else if (typeof lang === "string") {
    languageCode = lang; // si viene como string directo
  } else {
    return "Desconocido";
  }

  const normalized = languageCode.trim();
  return languageTranslations[normalized] || "Desconocido";
}
