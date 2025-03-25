
import React, { useCallback, useState } from 'react';
import { Upload, X, FileVideo } from 'lucide-react';
import { UploadedFile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface FileUploaderProps {
  onFileUpload: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onFileRemove: (id: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  uploadedFiles, 
  onFileRemove 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Process files
  const processFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files).filter(file => 
      file.type.startsWith('video/') || file.type.startsWith('audio/')
    );
    
    if (fileArray.length > 0) {
      const newFiles: UploadedFile[] = fileArray.map(file => {
        // Create video thumbnail
        let thumbnail: string | undefined;
        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            video.currentTime = 1; // Seek to 1 second
          };
          // This would typically happen in a callback, but for now we'll just create a placeholder
          thumbnail = undefined;
        }

        return {
          id: uuidv4(),
          file,
          thumbnail,
          progress: 0,
          status: 'idle'
        };
      });
      
      onFileUpload(newFiles);
    }
  }, [onFileUpload]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  // Handle file selection via input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input value to allow selecting same file again
    }
  }, [processFiles]);

  return (
    <div className="w-full">
      <div 
        className={`upload-area min-h-[200px] flex flex-col items-center justify-center p-8 ${isDragging ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full bg-primary/5 ${isDragging ? 'animate-pulse-subtle' : 'animate-float'}`}>
            <Upload className="h-10 w-10 text-primary/60" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-1">Drag & drop video files here</p>
            <p className="text-sm text-muted-foreground mb-4">Or click to browse your files</p>
            <label className="button-primary cursor-pointer inline-flex items-center gap-2">
              <FileVideo className="h-4 w-4" />
              Select Videos
              <input 
                type="file" 
                className="hidden" 
                accept="video/*,audio/*" 
                multiple 
                onChange={handleFileSelect} 
              />
            </label>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8 space-y-4 animate-fade-in">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map(file => (
              <div key={file.id} className="result-card p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.file.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <FileVideo className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <button 
                      onClick={() => onFileRemove(file.id)} 
                      className="text-gray-400 hover:text-destructive transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {file.status === 'uploading' && (
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-value" 
                        style={{ width: `${file.progress}%` }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
