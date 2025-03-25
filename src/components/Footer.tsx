
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-8 border-t border-gray-100 mt-12 animate-fade-in">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AutoDub. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="#" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <span className="text-xs text-muted-foreground">
            Version 1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
