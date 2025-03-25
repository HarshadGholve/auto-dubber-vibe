
import React from 'react';
import { Settings, ChevronDown, Check } from 'lucide-react';
import { AdvancedSettings as SettingsType, TTS_VOICES, DEFAULT_SETTINGS } from '@/lib/types';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AdvancedSettingsProps {
  settings: SettingsType;
  onChange: (settings: SettingsType) => void;
}

const AdvancedSettingsPanel: React.FC<AdvancedSettingsProps> = ({ 
  settings,
  onChange
}) => {
  const handleChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_SETTINGS);
  };

  return (
    <div className="w-full mt-6 animate-fade-in">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="settings">
          <AccordionTrigger className="text-sm font-medium flex items-center">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Settings
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tts-voice">TTS Voice</Label>
                  <Select 
                    value={settings.ttsVoice}
                    onValueChange={(value) => handleChange('ttsVoice', value)}
                  >
                    <SelectTrigger id="tts-voice">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {TTS_VOICES.map((voice) => (
                        <SelectItem key={voice} value={voice}>
                          {voice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="acceleration-rate">
                      Acceleration Rate: {settings.accelerationRate.toFixed(1)}x
                    </Label>
                  </div>
                  <Slider
                    id="acceleration-rate"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[settings.accelerationRate]}
                    onValueChange={(value) => handleChange('accelerationRate', value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="subtitles" className="flex-1">
                    Generate Subtitles
                  </Label>
                  <Switch
                    id="subtitles"
                    checked={settings.subtitles}
                    onCheckedChange={(checked) => handleChange('subtitles', checked)}
                  />
                </div>
                
                {settings.subtitles && (
                  <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                    <Label htmlFor="subtitle-format">Subtitle Format</Label>
                    <Select 
                      value={settings.subtitleFormat}
                      onValueChange={(value) => handleChange('subtitleFormat', value as any)}
                      disabled={!settings.subtitles}
                    >
                      <SelectTrigger id="subtitle-format">
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardcoded">Hardcoded</SelectItem>
                        <SelectItem value="srt">SRT File</SelectItem>
                        <SelectItem value="vtt">VTT File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-overlap" className="flex-1">
                    Avoid Audio Overlap
                  </Label>
                  <Switch
                    id="avoid-overlap"
                    checked={settings.avoidOverlap}
                    onCheckedChange={(checked) => handleChange('avoidOverlap', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-speakers">
                      Maximum Speakers: {settings.maxSpeakers}
                    </Label>
                  </div>
                  <Slider
                    id="max-speakers"
                    min={1}
                    max={10}
                    step={1}
                    value={[settings.maxSpeakers]}
                    onValueChange={(value) => handleChange('maxSpeakers', value[0])}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdvancedSettingsPanel;
