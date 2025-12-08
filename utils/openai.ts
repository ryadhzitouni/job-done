import OpenAI from "openai";

// On utilise NEXT_PUBLIC_ pour que ce soit accessible par le navigateur
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("⚠️ La variable NEXT_PUBLIC_OPENAI_API_KEY est manquante");
}

export const ai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // On autorise le navigateur
});
