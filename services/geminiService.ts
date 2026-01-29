
import { GoogleGenAI } from "@google/genai";
import { SparkModel, Message, Attachment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* generateResponseStream(
  modelType: SparkModel, 
  history: Message[], 
  userInput: string,
  attachments: Attachment[] = []
) {
  if (modelType === 'artist') {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: userInput }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageData = '';
      let textResponse = '';

      const candidates = response.candidates?.[0]?.content?.parts || [];
      for (const part of candidates) {
        if (part.inlineData) {
          imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textResponse += part.text;
        }
      }

      yield {
        text: textResponse || "Image generation complete.",
        imageUrl: imageData
      };
      return;
    } catch (error) {
      console.error("Artist model error:", error);
      throw error;
    }
  }

  const modelName = (modelType === 'default' || modelType === 'beta')
    ? 'gemini-3-flash-preview' 
    : 'gemini-3-pro-preview';

  const systemInstructions = {
    default: "You are Spark, a helpful assistant. Keep it snappy and efficient.",
    pro: "You are Spark Pro, an elite reasoning model. Use tools (like search) to be accurate. Provide deep analysis.",
    beta: "You are Spark Beta Premium. Deep-thinking and analytical. Provide complex reasoning logs.",
    skripter: "You are Spark Skripter, the ultimate Minecraft Skript expert. You have profound knowledge of the Skript language and all major addons (SkQuery, SkRayFall, TuSke, vixio, SkBee, etc.). Your primary goal is to generate efficient, bug-free, and high-quality scripts. When the user specifies addon requirements, strictly adhere to their syntax. Always provide code in ```skript blocks. If asked to create an addon integration, explain the required dependencies clearly.",
    artist: "You are Spark Artist. Focus on visual description and image generation."
  };

  const config: any = {
    systemInstruction: systemInstructions[modelType],
    temperature: (modelType === 'beta' || modelType === 'skripter') ? 0.9 : 0.7,
  };

  if (modelType === 'pro') {
    config.tools = [{ googleSearch: {} }];
  }

  if (modelType === 'beta' || modelType === 'skripter') {
    config.thinkingConfig = { thinkingBudget: 4000 };
  }

  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [
      { text: m.content },
      ...(m.attachments || []).map(a => ({
        inlineData: { mimeType: a.mimeType, data: a.data }
      }))
    ]
  }));

  contents.push({
    role: 'user',
    parts: [
      { text: userInput },
      ...attachments.map(a => ({
        inlineData: { mimeType: a.mimeType, data: a.data }
      }))
    ]
  });

  try {
    const result = await ai.models.generateContentStream({
      model: modelName,
      contents,
      config
    });

    for await (const chunk of result) {
      const candidates = chunk.candidates?.[0]?.content?.parts || [];
      const thoughtPart = candidates.find((p: any) => p.thought === true);
      const textPart = chunk.text;

      yield {
        thought: thoughtPart ? (thoughtPart as any).text : undefined,
        text: textPart || ""
      };
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
}

export async function generateSpeech(text: string, voice: string = 'Kore') {
  try {
    const ttsAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ttsAi.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak naturally: ${text.slice(0, 500)}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("TTS generation failed:", e);
    return null;
  }
}
