
import { Language, ProcessingResult, UploadedFile } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface TranslationResponse {
  videoUrls: string[];
  processingTime: string;
}

export async function translateVideos(
  files: UploadedFile[],
  sourceLanguage: Language,
  targetLanguages: Language[]
): Promise<TranslationResponse> {
  try {
    // Create form data to send files and parameters
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach(fileObj => {
      formData.append("videos", fileObj.file);
    });
    
    // Append source language
    formData.append("source_language", sourceLanguage.value);
    
    // Append each target language
    targetLanguages.forEach(lang => {
      formData.append("target_languages", lang.value);
    });
    
    // Send the request to the API
    const response = await fetch(`${API_URL}/translate`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to translate videos");
    }
    
    // The API returns FileResponses which are handled by the browser as downloads
    // For now, we'll just return success and processing time
    return {
      videoUrls: Array(targetLanguages.length).fill(""),  // Placeholder URLs
      processingTime: "Processing completed successfully"
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
