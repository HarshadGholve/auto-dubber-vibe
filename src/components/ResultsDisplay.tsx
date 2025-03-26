
import React from 'react';
import { Download, Play, Volume2 } from 'lucide-react';
import { ProcessingResult, Language } from '@/lib/types';

interface ResultsDisplayProps {
  results: ProcessingResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) return null;

  const handleDownload = (result: ProcessingResult) => {
    if (!result.videoUrl || result.videoUrl === '#') {
      alert('Video is still processing or unavailable for download.');
      return;
    }
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = result.videoUrl;
    a.download = `translated_${result.language.code}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePlay = (result: ProcessingResult) => {
    if (!result.videoUrl || result.videoUrl === '#') {
      alert('Video is not available for playback.');
      return;
    }
    
    window.open(result.videoUrl, '_blank');
  };

  return (
    <div className="w-full mt-12 animate-fade-in">
      <h3 className="text-xl font-semibold mb-6">Translated Videos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <div key={result.id} className="result-card overflow-hidden flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
              <img 
                src={result.thumbnail || '/placeholder.svg'} 
                alt={`Video in ${result.language.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                  aria-label="Play video"
                  onClick={() => handlePlay(result)}
                >
                  <Play className="h-6 w-6 text-primary" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="language-chip bg-primary/90 backdrop-blur-sm text-white">
                  {result.language.name}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{result.language.name}</span>
              </div>
              
              <button 
                onClick={() => handleDownload(result)}
                className="button-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
