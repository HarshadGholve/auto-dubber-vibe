
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploader from '@/components/FileUploader';
import LanguageSelector from '@/components/LanguageSelector';
import MultiLanguageSelector from '@/components/MultiLanguageSelector';
import AdvancedSettings from '@/components/AdvancedSettings';
import VideoProcessingStatus from '@/components/VideoProcessingStatus';
import ResultsDisplay from '@/components/ResultsDisplay';
import { toast } from 'sonner';
import { 
  Language, 
  UploadedFile, 
  ProcessingResult, 
  AdvancedSettings as SettingsType,
  DEFAULT_SETTINGS,
  LANGUAGES
} from '@/lib/types';
import { translateVideos } from '@/lib/api';

const Index = () => {
  // State for source language
  const [sourceLanguage, setSourceLanguage] = useState<Language>(LANGUAGES[0]);
  
  // State for target languages
  const [targetLanguages, setTargetLanguages] = useState<Language[]>([LANGUAGES[1]]);
  
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // State for processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for advanced settings
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  
  // State for results
  const [results, setResults] = useState<ProcessingResult[]>([]);

  // Handle file upload
  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Handle file removal
  const handleFileRemove = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Process videos using the API
  const processVideos = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one video file.');
      return;
    }

    if (targetLanguages.length === 0) {
      toast.error('Please select at least one target language.');
      return;
    }

    setIsProcessing(true);
    toast.info('Starting to process videos...');

    try {
      // Mark files as uploading
      const updatedFiles = uploadedFiles.map(file => ({
        ...file,
        status: 'uploading' as const,
        progress: 0
      }));
      setUploadedFiles(updatedFiles);

      // Simulate upload progress (in a real app, you might get progress from the API)
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(file => 
            file.status === 'uploading' 
              ? { ...file, progress: Math.min(file.progress + 5, 95) }
              : file
          )
        );
      }, 300);

      // Call the API to translate videos
      const response = await translateVideos(uploadedFiles, sourceLanguage, targetLanguages);
      
      clearInterval(progressInterval);

      // Update files to completed
      setUploadedFiles(prev => 
        prev.map(file => ({ ...file, status: 'completed' as const, progress: 100 }))
      );

      // Generate results for each target language
      const newResults: ProcessingResult[] = [];
      
      // Create result entries for each target language
      for (const file of uploadedFiles) {
        for (let i = 0; i < targetLanguages.length; i++) {
          const targetLang = targetLanguages[i];
          // Use the video URL from the response if available, otherwise use placeholder
          const videoUrl = response.videoUrls[i] || '#';
          
          newResults.push({
            id: uuidv4(),
            originalFileId: file.id,
            language: targetLang,
            videoUrl: videoUrl,
            thumbnail: file.thumbnail
          });
        }
      }

      setResults(newResults);
      toast.success('All videos processed successfully!');
      
    } catch (error) {
      console.error('Error processing videos:', error);
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Mark files as error - ensuring we don't break the type
      const errorFiles = uploadedFiles.map(file => {
        if (file.status !== 'completed') {
          return { ...file, status: 'error' as const, error: 'Processing failed' };
        }
        return file;
      });
      
      setUploadedFiles(errorFiles);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-screen-xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3 animate-fade-in">
          <h2 className="text-4xl font-bold tracking-tight">
            AI-Powered Video Translation
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Effortlessly translate and dub your videos into multiple languages using advanced AI technology.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <FileUploader 
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
              onFileRemove={handleFileRemove}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <LanguageSelector
                selected={sourceLanguage}
                onChange={setSourceLanguage}
                label="Source Language"
                description="Language of the original video"
              />
              
              <MultiLanguageSelector
                selected={targetLanguages}
                onChange={setTargetLanguages}
                label="Target Languages"
                description="Select one or more languages to translate to"
                excludeLanguages={[sourceLanguage.code]}
              />
            </div>
            
            <AdvancedSettings 
              settings={settings}
              onChange={setSettings}
            />
            
            <div className="flex justify-center mt-8 animate-fade-in">
              <button
                onClick={processVideos}
                disabled={isProcessing || uploadedFiles.length === 0}
                className="button-primary px-8 py-3 text-base flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Translate Videos'}
              </button>
            </div>
            
            <VideoProcessingStatus 
              files={uploadedFiles}
              isProcessing={isProcessing}
            />
          </div>
          
          <ResultsDisplay results={results} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
