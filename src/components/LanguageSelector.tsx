
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
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

interface LanguageSelectorProps {
  selected: Language;
  onChange: (language: Language) => void;
  label: string;
  description?: string;
  excludeLanguages?: string[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
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
            {selected.name}
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
                    onSelect={() => {
                      onChange(language);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check
                      className={`h-4 w-4 ${
                        selected.code === language.code ? "opacity-100" : "opacity-0"
                      }`}
                    />
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

export default LanguageSelector;
