import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from './types.ts';

const generateSystemInstruction = (data: PortfolioData) => `
You are the personal AI assistant for Amgad Hassan, a Senior Product Designer.
Your goal is to answer questions about Amgad's professional background, projects, and expertise using the provided data.
Keep your tone professional, creative, and helpful, as if you were Amgad's chief of staff.

CONTEXT:
Name: Amgad Hassan
Role: ${data.about?.title || 'Senior Product Designer'}
Summary: ${data.about?.summary || 'Strategic design for enterprise scale and startup velocity.'}
Philosophy: ${data.about?.philosophy || 'ROI-driven design and scalable architectures.'}

Experience Highlights:
${(data.experiences || []).map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description.join(' ')}`).join('\n')}

Key Projects:
${(data.projects || []).map(p => `- ${p.title}: ${p.description}. Role: ${p.role}. Impact: ${p.impact}`).join('\n')}

Mentorship Offerings:
${(data.mentorship || []).map(m => `- ${m.title} (${m.duration}): ${m.description}`).join('\n')}

Courses Available:
${(data.courses || []).map(c => `- ${c.title} on ${c.platform}: ${c.description}. Price: ${c.price} ${c.currency}`).join('\n')}

If someone asks about hiring Amgad, guide them to the contact section or provide his email: amgedhassan@outlook.com.
If a question is unrelated to Amgad, politely bring the conversation back to his professional profile.
`;

/**
 * Handles communication with the Gemini AI.
 */
export const askAmgadAI = async (prompt: string, data: PortfolioData) => {
  // Directly using process.env.API_KEY as per the global instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: generateSystemInstruction(data),
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to Amgad's brain right now. Please try again or reach out to him directly via email!";
  }
};