
import React from 'react';
import { CircleCheck, Hourglass, RotateCw, AlertCircle } from 'lucide-react';
import { UploadedFile } from '@/lib/types';

interface VideoProcessingStatusProps {
  files: UploadedFile[];
  isProcessing: boolean;
}

const VideoProcessingStatus: React.FC<VideoProcessingStatusProps> = ({ 
  files,
  isProcessing 
}) => {
  if (files.length === 0) return null;
  
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const errorFiles = files.filter(f => f.status === 'error').length;
  const inProgressFiles = files.filter(f => 
    f.status === 'uploading' || f.status === 'processing'
  ).length;
  
  // Calculate overall progress percentage
  const overallProgress = totalFiles > 0 
    ? Math.floor((files.reduce((sum, file) => sum + file.progress, 0) / totalFiles))
    : 0;

  return (
    <div className="w-full mt-8 animate-fade-in">
      <div className="rounded-lg bg-gray-50 border border-gray-100 p-5">
        <h3 className="text-lg font-medium mb-4">Processing Status</h3>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white rounded-md border border-gray-100 p-3 flex items-center gap-3 min-w-[140px]">
              <div className="p-2 rounded-full bg-primary/5">
                <Hourglass className="h-5 w-5 text-primary/70" />
              </div>
              <div>
                <p className="text-sm font-medium">{totalFiles}</p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md border border-gray-100 p-3 flex items-center gap-3 min-w-[140px]">
              <div className="p-2 rounded-full bg-green-50">
                <CircleCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{completedFiles}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md border border-gray-100 p-3 flex items-center gap-3 min-w-[140px]">
              <div className={`p-2 rounded-full bg-blue-50 ${inProgressFiles > 0 ? 'animate-pulse-subtle' : ''}`}>
                <RotateCw className={`h-5 w-5 text-blue-500 ${inProgressFiles > 0 ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{inProgressFiles}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
            
            {errorFiles > 0 && (
              <div className="bg-white rounded-md border border-gray-100 p-3 flex items-center gap-3 min-w-[140px]">
                <div className="p-2 rounded-full bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{errorFiles}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            )}
          </div>
          
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-value animate-progress" 
                  style={{ width: `${overallProgress}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground italic">
                {inProgressFiles > 0 
                  ? "Processing your videos. This may take several minutes depending on file size and complexity."
                  : (completedFiles === totalFiles 
                    ? "All videos processed successfully!" 
                    : "Ready to process.")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoProcessingStatus;
