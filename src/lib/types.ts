
// Language-related interfaces
export interface Language {
  code: string;
  name: string;
  value: string;
}

export const LANGUAGES: Language[] = [
  { code: "auto", name: "Automatic detection", value: "Automatic detection" },
  { code: "en", name: "English", value: "English (en)" },
  { code: "es", name: "Spanish", value: "Spanish (es)" },
  { code: "fr", name: "French", value: "French (fr)" },
  { code: "de", name: "German", value: "German (de)" },
  { code: "it", name: "Italian", value: "Italian (it)" },
  { code: "pt", name: "Portuguese", value: "Portuguese (pt)" },
  { code: "zh", name: "Chinese", value: "Chinese (zh)" },
  { code: "ja", name: "Japanese", value: "Japanese (ja)" },
  { code: "ko", name: "Korean", value: "Korean (ko)" },
  { code: "ru", name: "Russian", value: "Russian (ru)" },
  { code: "ar", name: "Arabic", value: "Arabic (ar)" },
  { code: "hi", name: "Hindi", value: "Hindi (hi)" },
];

// File upload interfaces
export interface UploadedFile {
  id: string;
  file: File;
  thumbnail?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Processing result interfaces
export interface ProcessingResult {
  id: string;
  originalFileId: string;
  language: Language;
  videoUrl: string;
  thumbnail?: string;
}

// Settings interfaces
export interface AdvancedSettings {
  ttsVoice: string;
  accelerationRate: number;
  subtitles: boolean;
  subtitleFormat: 'none' | 'hardcoded' | 'srt' | 'vtt';
  avoidOverlap: boolean;
  maxSpeakers: number;
}

export const DEFAULT_SETTINGS: AdvancedSettings = {
  ttsVoice: "en-US-EmmaMultilingualNeural-Female",
  accelerationRate: 1.0,
  subtitles: false,
  subtitleFormat: 'none',
  avoidOverlap: true,
  maxSpeakers: 2
};

// Voice options
export const TTS_VOICES = [
  "en-US-EmmaMultilingualNeural-Female",
  "en-US-RyanMultilingualNeural-Male",
  "fr-FR-DeniseNeural-Female",
  "es-ES-ElviraNeural-Female",
  "de-DE-KatjaNeural-Female",
  "ja-JP-NanamiNeural-Female",
  "zh-CN-XiaoxiaoNeural-Female",
];
