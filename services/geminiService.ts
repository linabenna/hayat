
import { GoogleGenAI, Type } from "@google/genai";
import { Message, FamilyMember, AgentAlert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAgentReasoning = async (
  agentName: string, 
  context: string,
  family: FamilyMember[]
) => {
  const model = 'gemini-3-flash-preview';
  const familyList = family.map(f => `${f.name} (${f.role})`).join(', ');
  
  const response = await ai.models.generateContent({
    model,
    contents: `As the HAYAT ${agentName} AI agent for a UAE-based family (Members: ${familyList}), provide a short, human-readable trace analysis of this situation: "${context}". 
    
    CRITICAL RULES:
    1. Output MUST be plain text only.
    2. Use Sentence case (not all caps).
    3. Be extremely concise (max 3 sentences).
    4. Focus on the impact on the family unit.
    5. No bolding, bullet points, or special characters.`,
    config: {
      temperature: 0.5,
      topP: 0.95,
    }
  });

  return response.text;
};

export const chatWithGuardian = async (
  messages: Message[],
  alerts: AgentAlert[],
  family: FamilyMember[]
) => {
  const model = 'gemini-3-flash-preview';
  const lastMessage = messages[messages.length - 1].content;
  
  const systemInstruction = `
    You are HAYAT, the Family Guardian Agent (Orchestrator).
    Your tone is calm, professional, and culturally appropriate for the UAE.
    You manage a family unit.
    Active Alerts: ${JSON.stringify(alerts)}
    Family Structure: ${JSON.stringify(family)}
    
    Responsibilities:
    1. Answer queries about the family's government status.
    2. Guide users through renewals or fine payments.
    3. Be proactive: if a visa is expiring soon, mention it.
    4. Use local UAE terms like "ICP", "GDRFA", "Emirates ID", "RTA", "UAE Pass".
    5. Always provide "Trace" reasoning in plain text and sentence case.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: lastMessage,
    config: {
      systemInstruction,
      temperature: 0.8,
    }
  });

  return response.text;
};
