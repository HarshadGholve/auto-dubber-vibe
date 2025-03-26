
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
    
    // Handle video downloads from FastAPI FileResponse
    // We expect an array of video files
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("multipart/form-data")) {
      // Multiple files as form data
      // This would need specific handling on the client side
      throw new Error("Multipart responses are not supported in the browser. Consider modifying the API to return URLs or a single zip file.");
    } else if (contentType && contentType.includes("video")) {
      // Single video file response
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      
      // Try to get filename from content-disposition
      const contentDisposition = response.headers.get("content-disposition");
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
      // Handle application/json or other content types
      try {
        // Try to parse as JSON first
        const data = await response.json();
        if (Array.isArray(data)) {
          // Array of video URLs
          return {
            videoUrls: data,
            processingTime: "Processing completed successfully"
          };
        } else {
          // Single video URL or other data
          return {
            videoUrls: [data],
            processingTime: "Processing completed successfully"
          };
        }
      } catch (e) {
        // If not JSON, try to handle as blob and create URL
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        return {
          videoUrls: [videoUrl],
          processingTime: "Processing completed successfully"
        };
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
