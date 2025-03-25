
import React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Language, LANGUAGES } from '@/lib/types';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';

interface MultiLanguageSelectorProps {
  selected: Language[];
  onChange: (languages: Language[]) => void;
  label: string;
  description?: string;
  excludeLanguages?: string[];
}

const MultiLanguageSelector: React.FC<MultiLanguageSelectorProps> = ({
  selected,
  onChange,
  label,
  description,
  excludeLanguages = []
}) => {
  const [open, setOpen] = React.useState(false);
  
  const filteredLanguages = LANGUAGES.filter(
    language => !excludeLanguages.includes(language.code)
  );

  const toggleLanguage = (language: Language) => {
    const isSelected = selected.some(l => l.code === language.code);
    
    if (isSelected) {
      onChange(selected.filter(l => l.code !== language.code));
    } else {
      onChange([...selected, language]);
    }
  };

  const removeLanguage = (code: string) => {
    onChange(selected.filter(l => l.code !== code));
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-expanded={open}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex flex-1 items-center gap-1 flex-wrap">
              {selected.length > 0 ? (
                selected.map(lang => (
                  <span key={lang.code} className="inline-flex items-center bg-secondary text-secondary-foreground rounded-full text-xs px-2 py-1 mr-1">
                    {lang.name}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLanguage(lang.code);
                      }} 
                      className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">Select languages...</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    onSelect={() => toggleLanguage(language)}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                      selected.some(l => l.code === language.code) 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "opacity-50"
                    }`}>
                      {selected.some(l => l.code === language.code) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {language.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiLanguageSelector;
