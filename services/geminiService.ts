import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdea } from '../types';

const getApiKey = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gemini_api_key') || '';
    }
    return '';
};

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "アイデアの簡潔なタイトル (日本語)",
            },
            description: {
                type: Type.STRING,
                description: "アイデアの具体的な説明 (日本語)",
            },
            tags: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: "関連するタグの配列 (日本語)"
            }
        },
        required: ["title", "description", "tags"],
    },
};


export const generateRelatedIdeas = async (topic: string): Promise<GeneratedIdea[]> => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error("APIキーが設定されていません。設定画面からGemini APIキーを入力してください。");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const prompt = `「${topic}」というテーマに関するブレインストーミングのアイデアを5つ、創造的かつ具体的に提案してください。それぞれのアイデアにはタイトル、説明、そして関連タグを含めてください。`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const generatedIdeas: GeneratedIdea[] = JSON.parse(jsonText);

        return generatedIdeas;

    } catch (error) {
        console.error("Error generating ideas with Gemini:", error);
        throw new Error("AIによるアイデアの生成に失敗しました。");
    }
};
