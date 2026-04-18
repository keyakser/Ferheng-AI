import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DictionaryResult } from "../types";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const ESTIMATED_COST_PER_1K_TOKENS = 0.000125; // Example for Flash model

const logApiUsage = async (model: string, tokens: number, uid?: string) => {
  try {
    const estimatedCost = (tokens / 1000) * ESTIMATED_COST_PER_1K_TOKENS;
    
    // Log to api_usage collection
    await addDoc(collection(db, "api_usage"), {
      model,
      tokens,
      estimatedCost,
      uid: uid || "anonymous",
      timestamp: Date.now()
    });

    // Update user's total apiUsage
    if (uid) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        apiUsage: increment(tokens)
      });
    }
  } catch (error) {
    console.error("Error logging API usage:", error);
  }
};

export const fetchDefinitions = async (
  word: string,
  sourceLang: string,
  targetLangs: { code: string; name: string }[],
  uid?: string
): Promise<DictionaryResult[]> => {
  try {
    const targetLangsStr = targetLangs.map(l => `${l.name} (code: ${l.code})`).join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Provide detailed dictionary entries for the word "${word}" from ${sourceLang} to the following target languages: ${targetLangsStr}. 
      For EACH target language specified, provide one or more result objects.
      
      For each entry:
      - "term": The translated word in the TARGET language (e.g., if translating from Kurdish to English, this should be the English word).
      - "definition": A clear definition of the translated word in the TARGET language.
      - "category": Part of speech (e.g., Noun, Verb, Adjective).
      - "type": Usage type (e.g., Common, Formal, Slang).
      - "gender": If the TARGET language has grammatical gender (like Kurdish Kurmanji/Zazaki), provide it. If the SOURCE language is Kurdish and the TARGET is not (like English), provide the gender of the source word "${word}" here, as it's essential for Kurdish learners. Use "Masc" or "Fem".
      - "example_source": An example sentence using the original word "${word}" in ${sourceLang}.
      - "example_target": The translation of that example sentence in the TARGET language. If the TARGET language is Sorani (ckb), Arabic (ar), or Persian (fa), include the Latin transliteration in parentheses at the end of the sentence.
      - "transliteration": Latin transliteration. MANDATORY for Sorani (ckb), Arabic (ar), and Persian (fa). For Sorani, provide the standard Latin script (Kurmancî-style) version of the word.
      
      CRITICAL: The "term" field MUST be the translation, NOT the source word "${word}".
      CRITICAL: You MUST use the exact language code provided (e.g., 'ku', 'ckb', 'kiu') for the "targetLang" field in each result object.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              targetLang: { type: Type.STRING, description: "The language code of this translation" },
              definition: { type: Type.STRING },
              category: { type: Type.STRING, description: "e.g. Noun, Verb, Adjective" },
              type: { type: Type.STRING, description: "e.g. Common, Formal, Slang" },
              gender: { type: Type.STRING, description: "e.g. Masc, Fem, or null" },
              transliteration: { type: Type.STRING, description: "Latin transliteration. MANDATORY for Sorani, Arabic, and Persian." },
              example_source: { type: Type.STRING, description: "Example sentence in source language" },
              example_target: { type: Type.STRING, description: "Example sentence in target language" },
            },
            required: ["term", "targetLang", "definition", "category", "type", "example_source", "example_target"],
          },
        },
      },
    });

    // Log usage (rough estimate of tokens based on characters if usage metadata not available)
    // In a real app, you'd use response.usageMetadata
    const tokens = Math.ceil((word.length + response.text.length) / 4);
    logApiUsage("gemini-3.1-flash-lite-preview", tokens, uid);

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching definitions from Gemini:", error);
    return [];
  }
};
