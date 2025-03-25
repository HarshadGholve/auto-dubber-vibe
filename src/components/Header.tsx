
import React from 'react';
import { Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between border-b border-gray-100 animate-fade-in">
      <div className="flex items-center gap-2">
        <Globe className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">AutoDub</h1>
      </div>
      <nav className="flex items-center gap-6">
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Documentation
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Support
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
};

export default Header;
