import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
if (!process.env.GEMINI_API_KEY) {

}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini Pro model with configuration
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  }
});

export const generateResponse = async (prompt) => {
  try {
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response from Gemini");
  }
}; 
 export default generateResponse;