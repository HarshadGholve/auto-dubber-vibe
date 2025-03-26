
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
    
    console.log("Sending request to API:", `${API_URL}/translate`);
    console.log("Files being sent:", files.length);
    console.log("Target languages:", targetLanguages.map(lang => lang.value));
    
    // Send the request to the API
    const response = await fetch(`${API_URL}/translate`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || "Failed to translate videos";
      } catch (e) {
        errorMessage = errorText || "Failed to translate videos";
      }
      throw new Error(errorMessage);
    }
    
    // Handle video downloads
    // The response might be a blob of multiple files
    // We'll return URLs the user can download
    const contentType = response.headers.get("content-type");
    const contentDisposition = response.headers.get("content-disposition");
    
    if (contentType && contentType.includes("video")) {
      // Single video file response
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      
      // Try to get filename from content-disposition
      let filename = "translated_video.mp4";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      return {
        videoUrls: [videoUrl],
        processingTime: "Processing completed successfully"
      };
    } else {
      // API might return JSON with file URLs or other information
      try {
        const data = await response.json();
        return {
          videoUrls: Array.isArray(data) ? data : [data],
          processingTime: "Processing completed successfully"
        };
      } catch (e) {
        // If it's not JSON, it might be a multi-file response 
        // which browser might not handle well
        return {
          videoUrls: ["#"], // Placeholder
          processingTime: "Videos processed but need server-side handling for downloads"
        };
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
