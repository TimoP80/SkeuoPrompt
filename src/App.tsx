import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Copy, Sparkles, Loader2, Check, Download, ZoomIn, X } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('None');
  const [generationMode, setGenerationMode] = useState<'Image' | 'Video' | 'Script'>('Image');
  const [selectedEra, setSelectedEra] = useState('Cyberpunk');
  const [selectedLighting, setSelectedLighting] = useState('Cinematic');
  const [selectedCamera, setSelectedCamera] = useState('Wide-angle');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [selectedMedium, setSelectedMedium] = useState('Photorealistic');
  const [selectedMotion, setSelectedMotion] = useState('Tracking Shot');
  const [selectedFormat, setSelectedFormat] = useState('Film Scene');
  const [selectedTone, setSelectedTone] = useState('Dark & Gritty');
  const [selectedPacing, setSelectedPacing] = useState('Fast-Paced');
  const [selectedDialogue, setSelectedDialogue] = useState('Naturalistic');
  const [selectedAction, setSelectedAction] = useState('Realistic');
  const [selectedSound, setSelectedSound] = useState('Heavy Foley');
  const [selectedVoice, setSelectedVoice] = useState('Distinct');
  const [selectedSubplot, setSelectedSubplot] = useState('Linear');
  const [selectedTransition, setSelectedTransition] = useState('Hard Cuts');
  const [advNoise, setAdvNoise] = useState(false);
  const [advGlow, setAdvGlow] = useState(false);
  const [advTexture, setAdvTexture] = useState(false);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState('Standard');

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(false);

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `rendered-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const scriptTemplates = {
    'Sci-Fi': {
      prompt: 'A genius hacker discovers a hidden piece of code within the megacity\'s central AI that reveals a terrifying truth about humanity\'s past, plunging them into a desperate race against time.',
      era: 'Cyberpunk',
      format: 'Film Scene',
      tone: 'Suspenseful',
      pacing: 'Fast-Paced',
      dialogue: 'Sparse',
      action: 'Realistic',
      sound: 'Synth-Heavy Score',
      voice: 'Distinct',
      subplot: 'Twisting',
      transition: 'Smash Cuts'
    },
    'Comedy': {
      prompt: 'Two rival bakers at a local competition accidentally swap their secret ingredients, leading to chaotic and hilarious outcomes during the final judging phase.',
      era: 'Retro-Futurism',
      format: 'Short',
      tone: 'Satirical',
      pacing: 'Frenetic',
      dialogue: 'Punchy & Witty',
      action: 'Over-the-top',
      sound: 'Heavy Foley',
      voice: 'Quirky',
      subplot: 'Minimal',
      transition: 'Hard Cuts'
    },
    'Drama': {
      prompt: 'An estranged family gathers in a remote, decaying manor to read the final will of their wealthy patriarch, inadvertently unveiling dark family secrets that threaten to tear them apart forever.',
      era: 'Post-Apocalypse',
      format: 'TV Cold Open',
      tone: 'Dark & Gritty',
      pacing: 'Slow Burn',
      dialogue: 'Naturalistic',
      action: 'Minimalist',
      sound: 'Orchestral Sweep',
      voice: 'Archetypal',
      subplot: 'Multi-thread',
      transition: 'Cross-fades'
    },
    'Action': {
      prompt: 'A retired special forces operative must rescue hostages from a hijacked skyscraper, relying on their training and improvised weapons as they ascend floor by floor.',
      era: 'Cyberpunk',
      format: 'Film Scene',
      tone: 'Suspenseful',
      pacing: 'Fast-Paced',
      dialogue: 'Punchy & Witty',
      action: 'Chaotic',
      sound: 'Heavy Foley',
      voice: 'Stoic',
      subplot: 'Minimal',
      transition: 'Match Cuts'
    },
    'Horror': {
      prompt: 'A group of urban explorers investigate an abandoned hospital ward and realize too late that the building itself is alive and trying to keep them inside.',
      era: 'Deep Space',
      format: 'Short',
      tone: 'Dark & Gritty',
      pacing: 'Slow Burn',
      dialogue: 'Sparse',
      action: 'Minimalist',
      sound: 'Dead Silence',
      voice: 'Distinct',
      subplot: 'Linear',
      transition: 'Hard Cuts'
    }
  };

  const applyTemplate = (genre: keyof typeof scriptTemplates) => {
    const template = scriptTemplates[genre];
    setInputPrompt(template.prompt);
    setSelectedEra(template.era);
    setSelectedFormat(template.format);
    setSelectedTone(template.tone);
    setSelectedPacing(template.pacing);
    setSelectedDialogue(template.dialogue);
    setSelectedAction(template.action);
    setSelectedSound(template.sound);
    setSelectedVoice(template.voice);
    setSelectedSubplot(template.subplot);
    setSelectedTransition(template.transition);
  };

  const getThemeStyles = () => {
    switch (selectedStyle) {
      case 'Retro 80s Electronics':
        return {
          bg: 'bg-[#111] bg-[radial-gradient(circle_at_center,_#222_0%,_#000_100%)]',
          casing: 'bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] border-[#4a4a4a] shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_4px_0_rgba(255,255,255,0.2),inset_0_-8px_0_rgba(0,0,0,0.8)]',
          labelBg: 'bg-[#2a2a2a] border-[#4a4a4a]',
          labelText: 'text-[#00ffcc]',
          labelAccent: 'text-[#ff00ff]',
          screw: 'from-gray-600 to-gray-800 border-gray-900',
          text: 'text-[#aaaaaa]',
          panelBg: 'bg-[#2a2a2a] border-[#4a4a4a]',
          panelText: 'text-[#aaaaaa]',
          btnBase: 'from-[#444] to-[#222] text-[#ccc]',
          btnActive: 'from-[#00ffcc] to-[#009977] text-[#000]',
          ledBtn: 'bg-[#ff00ff] shadow-[0_0_5px_#ff00ff,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case '70s Woodgrain Hi-Fi':
        return {
          bg: 'bg-[#1a110c] bg-[radial-gradient(circle_at_center,_#3a2315_0%,_#0a0502_100%)]',
          casing: 'bg-gradient-to-b from-[#8b5a2b] to-[#4a2f1d] border-[#3a1f0d] shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_4px_0_rgba(255,255,255,0.3),inset_0_-8px_0_rgba(0,0,0,0.8)]',
          labelBg: 'bg-[#d4af37] border-[#996515]',
          labelText: 'text-[#3a1f0d]',
          labelAccent: 'text-[#8b0000]',
          screw: 'from-yellow-600 to-yellow-800 border-yellow-900',
          text: 'text-[#d4af37]',
          panelBg: 'bg-[#5c3a21] border-[#3a1f0d]',
          panelText: 'text-[#d4af37]',
          btnBase: 'from-[#8b5a2b] to-[#5c3a21] text-[#d4af37]',
          btnActive: 'from-[#ffcc00] to-[#d9a600] text-[#4a3000]',
          ledBtn: 'bg-[#ff3300] shadow-[0_0_5px_#ff3300,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case 'Brushed Heavy Metal':
        return {
          bg: 'bg-[#222] bg-[radial-gradient(circle_at_center,_#444_0%,_#111_100%)]',
          casing: 'bg-gradient-to-b from-[#e0e0e0] to-[#888888] border-[#666666] shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_4px_0_rgba(255,255,255,0.9),inset_0_-8px_0_rgba(0,0,0,0.5)]',
          labelBg: 'bg-[#cccccc] border-[#999999]',
          labelText: 'text-[#333333]',
          labelAccent: 'text-[#000000]',
          screw: 'from-gray-300 to-gray-500 border-gray-600',
          text: 'text-[#333333]',
          panelBg: 'bg-[#b0b0b0] border-[#888888]',
          panelText: 'text-[#333333]',
          btnBase: 'from-[#d4d4d4] to-[#a0a0a0] text-[#333]',
          btnActive: 'from-[#ffcc00] to-[#d9a600] text-[#4a3000]',
          ledBtn: 'bg-[#00ccff] shadow-[0_0_5px_#00ccff,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case 'Retro Digital Interface':
        return {
          bg: 'bg-[#001122] bg-[radial-gradient(circle_at_center,_#003366_0%,_#000511_100%)]',
          casing: 'bg-gradient-to-b from-[#1a2b3c] to-[#0a1b2c] border-[#334455] shadow-[0_40px_80px_rgba(0,10,20,0.9),inset_0_4px_0_rgba(255,255,255,0.1),inset_0_-8px_0_rgba(0,0,0,0.8)]',
          labelBg: 'bg-[#000511] border-[#003366]',
          labelText: 'text-[#00ffff]',
          labelAccent: 'text-[#0088ff]',
          screw: 'from-blue-900 to-black border-blue-900',
          text: 'text-[#00aaaa]',
          panelBg: 'bg-[#05111d] border-[#003366]',
          panelText: 'text-[#00aaaa]',
          btnBase: 'from-[#112233] to-[#001122] text-[#00aaaa]',
          btnActive: 'from-[#00ffff] to-[#0088cc] text-[#001122]',
          ledBtn: 'bg-[#00ffff] shadow-[0_0_5px_#00ffff,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case 'Brass & Leather':
        return {
          bg: 'bg-[#1a0f0a] bg-[radial-gradient(circle_at_center,_#331f14_0%,_#0a0502_100%)]',
          casing: 'bg-gradient-to-b from-[#5c3a21] to-[#2e1d10] border-[#b5a642] shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_4px_0_rgba(181,166,66,0.3),inset_0_-8px_0_rgba(0,0,0,0.9)]',
          labelBg: 'bg-gradient-to-b from-[#d4af37] to-[#aa8529] border-[#8c6d23]',
          labelText: 'text-[#2e1d10]',
          labelAccent: 'text-[#5c3a21]',
          screw: 'from-[#d4af37] to-[#8c6d23] border-[#5c4a11]',
          text: 'text-[#b5a642]',
          panelBg: 'bg-[#3d2616] border-[#b5a642]',
          panelText: 'text-[#b5a642]',
          btnBase: 'from-[#b5a642] to-[#8c6d23] text-[#2e1d10]',
          btnActive: 'from-[#e6dfd1] to-[#b5a892] text-[#2e1d10]',
          ledBtn: 'bg-[#ffaa00] shadow-[0_0_5px_#ffaa00,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case 'Bakelite Radio':
        return {
          bg: 'bg-[#e6d0b8] bg-[radial-gradient(circle_at_center,_#f5ebd6_0%,_#c2a385_100%)]',
          casing: 'bg-gradient-to-b from-[#4a1515] to-[#260505] border-[#1f0303] shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_5px_5px_rgba(255,255,255,0.2),inset_0_-10px_10px_rgba(0,0,0,0.8)]',
          labelBg: 'bg-[#f5ebd6] border-[#d4ae8c]',
          labelText: 'text-[#4a1515]',
          labelAccent: 'text-[#db8b00]',
          screw: 'from-[#8b3a3a] to-[#3a0a0a] border-[#220000]',
          text: 'text-[#f5ebd6]',
          panelBg: 'bg-[#360d0d] border-[#5c1c1c]',
          panelText: 'text-[#e6d0b8]',
          btnBase: 'from-[#e6d0b8] to-[#c2a385] text-[#4a1515]',
          btnActive: 'from-[#ffaa00] to-[#cc7700] text-[#1f0303]',
          ledBtn: 'bg-[#ff5500] shadow-[0_0_5px_#ff5500,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
      case 'None':
      default:
        return {
          bg: 'bg-[#2c1e16] bg-[radial-gradient(circle_at_center,_#4a3325_0%,_#1a110c_100%)]',
          casing: 'bg-gradient-to-b from-[#e6dfd1] to-[#c5bba3] border-[#a39882] shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_4px_0_rgba(255,255,255,0.9),inset_0_-8px_0_rgba(0,0,0,0.3)]',
          labelBg: 'bg-[#d4cbb8] border-[#b5a892]',
          labelText: 'text-[#4a4030]',
          labelAccent: 'text-[#8b7a5e]',
          screw: 'from-gray-300 to-gray-500 border-gray-600',
          text: 'text-[#5a5040]',
          panelBg: 'bg-[#b5a892] border-[#8b7a5e]',
          panelText: 'text-[#4a4030]',
          btnBase: 'from-[#d4cbb8] to-[#b5a892] text-[#4a4030]',
          btnActive: 'from-[#ffcc00] to-[#d9a600] text-[#4a3000]',
          ledBtn: 'bg-[#ffcc00] shadow-[0_0_5px_#ffcc00,inset_0_1px_1px_rgba(255,255,255,0.8)]',
        };
    }
  };

  const theme = getThemeStyles();

  const handleGenerate = async () => {
    if (!inputPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setOutputPrompt('');
    setGeneratedImageUrl(null);
    
    try {
      let basePrompt = '';

      if (generationMode === 'Script') {
        basePrompt = `You are an expert AI screenwriter. Expand the simple concept below into a full, detailed script.

CRITICAL INSTRUCTIONS:
Reimagine the concept through a highly detailed lens. You MUST incorporate the following Script Parameters explicitly into the script:
- Genre / Setting: ${selectedEra}
- Format / Structure: ${selectedFormat}
- Tone: ${selectedTone}
- Pacing: ${selectedPacing}
- Dialogue Style: ${selectedDialogue}
- Action Sequence Intensity: ${selectedAction}
- Sound Design Emphasis: ${selectedSound}
- Character Voice Profiles: ${selectedVoice}
- Sub-plot Complexity: ${selectedSubplot}
- Scene Transition Styles: ${selectedTransition}
- Tactile/Material Aesthetic Focus: ${selectedTexture}
- Additional Aspects: ${advNoise ? 'Include gritty details/noise' : 'Clean'} | ${advGlow ? 'Highlight vibrant/glowing elements' : 'Natural lighting'} | ${advTexture ? 'Focus on intricate sensory details' : 'Standard detail'}

Format the Output:
Write a professional screenplay format with Scene Headings, Action Lines, Character Names, Parentheticals, and Dialogue.
Return ONLY the script text, with no conversational filler.

Simple concept: ${inputPrompt}`;
      } else {
        const isVideo = generationMode === 'Video';
        
        basePrompt = `You are an expert AI prompt engineer. Expand the simple concept below into a highly detailed, descriptive ${isVideo ? 'video' : 'image'} generation prompt for ${isVideo ? 'Sora, Runway Gen-3, or Luma Dream Machine' : 'Midjourney or Stable Diffusion'}.

CRITICAL INSTRUCTIONS:
Reimagine the concept through a futuristic, sci-fi lens. You MUST incorporate the following Rendering Parameters explicitly into the prompt text:
- Artistic Style: ${selectedStyle !== 'None' ? selectedStyle + ' skeuomorphic design' : 'Futuristic'}
- Material Texture Emphasis: ${selectedTexture}
- Era/Subgenre: ${selectedEra}
- Lighting: ${selectedLighting}
- Camera Perspective: ${selectedCamera}
- Medium: ${selectedMedium}
${isVideo ? `- Camera Motion: ${selectedMotion}` : ''}
${isVideo ? `- Video Pacing: ${selectedPacing}` : ''}
- Noise Level: ${advNoise ? 'Heavy cinematic film grain, high ISO noise' : 'Clean / Noise-free'}
- Glow/Bloom: ${advGlow ? 'Intense volumetric glow, bloom, neon bleeding' : 'Standard natural lighting'}
- Texture Detail: ${advTexture ? 'Hyper-detailed, microscopic texture focus, pristine 8k resolution' : 'Standard detail'}

Format the Output:
Write a single cohesive paragraph containing rich descriptive tags.
${isVideo ? 'Focus heavily on the flow of motion, physics of objects, and evolving temporal dynamics.\n' : ''}You MUST end the prompt with this exact aspect ratio argument: --ar ${selectedAspectRatio}`;

        if (isVideo && generateAudio) {
          basePrompt += `\n\nAdditionally, write a SECOND PARAGRAPH specifically focused on describing the accompanying Audio Track. This acoustic/audio prompt should describe the soundscape, foley, musical score, and audio atmosphere perfectly synced to the video describing instruments, pacing, and emotional tone. Incorporate the following Sound Design Emphasis: ${selectedSound}. Prefix this paragraph with "AUDIO TRACK PROMPT:".`;
        }
        
        basePrompt += `\n\nReturn ONLY the expanded prompt text(s), with no conversational filler.\n\nSimple concept: ${inputPrompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: basePrompt,
      });
      
      setOutputPrompt(response.text || 'Failed to generate prompt.');
    } catch (error) {
      console.error('Error generating prompt:', error);
      setOutputPrompt('Error: Could not connect to the prompt expansion matrix.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!outputPrompt.trim() || isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    
    // gemini-2.5-flash-image aspect ratio mapping
    let ar = selectedAspectRatio;
    if (ar === '21:9') ar = '16:9';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: outputPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
              aspectRatio: ar,
          }
        }
      });
      
      let base64String = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64String = part.inlineData.data;
          break;
        }
      }
      
      if (base64String) {
        setGeneratedImageUrl(`data:image/png;base64,${base64String}`);
      } else {
        console.error("No image data returned from Gemini.");
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = () => {
    if (!outputPrompt) return;
    navigator.clipboard.writeText(outputPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Screw = ({ className, themeClass }: { className?: string, themeClass?: string }) => (
    <div className={`absolute w-5 h-5 rounded-full bg-gradient-to-br ${themeClass || 'from-gray-300 to-gray-500 border-gray-600'} shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center border ${className}`}>
      <div className="w-full h-[2px] bg-gray-700 rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.4)]"></div>
    </div>
  );

  const ParameterBank = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-2">
      <div className={`${theme.text} text-[10px] font-bold uppercase tracking-wider transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="relative outline-none group"
          >
            <div className="absolute inset-0 bg-[#111] opacity-50 rounded translate-y-1"></div>
            <div className={`relative py-1.5 px-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider rounded border border-black/20 transition-all duration-300 ${
              value === opt
                ? `bg-gradient-to-b ${theme.btnActive} translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`
                : `bg-gradient-to-b ${theme.btnBase} shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] group-active:translate-y-1 group-hover:brightness-110`
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${value === opt ? theme.ledBtn : 'bg-black/30 shadow-inner'}`} />
              <span className="leading-none pt-px">{opt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) => (
    <div className="flex flex-col items-center gap-3">
      <div className={`${theme.text} text-[9px] w-full text-center font-bold uppercase tracking-widest transition-colors duration-500 opacity-80`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
        {label}
      </div>
      <div className="relative">
        {/* LED */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/50 shadow-inner">
           <div className={`w-full h-full rounded-full transition-all duration-300 ${checked ? theme.ledBtn : 'opacity-0'}`} />
        </div>
        <button
          onClick={() => onChange(!checked)}
          className="relative w-8 h-12 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] border border-black bg-[#1a1a1a] p-0.5 outline-none group flex-shrink-0 focus:ring-1 focus:ring-black/20"
        >
          {/* Switch Body */}
          <div className={`absolute left-0.5 right-0.5 h-[55%] rounded-sm transition-all duration-200 ease-in-out ${checked ? 'top-0.5 bg-gradient-to-b from-[#e0e0e0] to-[#999999] shadow-[0_2px_2px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.9)]' : 'bottom-0.5 bg-gradient-to-b from-[#888888] to-[#555555] shadow-[0_-1px_2px_rgba(0,0,0,0.4),inset_0_-1px_1px_rgba(255,255,255,0.3)]'}`}>
            <div className="w-full h-full flex flex-col justify-center items-center gap-[2px] opacity-40">
              <div className="w-4 h-[1px] bg-black rounded-full"></div>
              <div className="w-4 h-[1px] bg-black rounded-full"></div>
              <div className="w-4 h-[1px] bg-black rounded-full"></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-4 md:p-8 font-sans transition-colors duration-500`}>
      
      {/* Main Device Casing */}
      <div className={`${theme.casing} p-6 md:p-10 rounded-[2.5rem] border max-w-5xl w-full relative transition-all duration-500`}>
        
        {/* Screws */}
        <Screw className="top-6 left-6" themeClass={theme.screw} />
        <Screw className="top-6 right-6" themeClass={theme.screw} />
        <Screw className="bottom-6 left-6" themeClass={theme.screw} />
        <Screw className="bottom-6 right-6" themeClass={theme.screw} />

        {/* Device Label */}
        <div className="flex justify-center mb-10">
          <div className={`${theme.labelBg} px-8 py-3 rounded-lg shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_2px_0_rgba(255,255,255,0.8)] border flex items-center gap-4 transition-colors duration-500`}>
            <div className={`w-3 h-3 rounded-full bg-red-500 transition-all duration-300 ${isGenerating ? 'animate-[pulse_0.4s_ease-in-out_infinite] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(255,50,50,1)] brightness-125' : 'animate-[pulse_2s_ease-in-out_infinite] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_8px_rgba(239,68,68,0.8)]'}`}></div>
            <h1 className={`${theme.labelText} font-bold text-xl md:text-2xl uppercase tracking-[0.2em] transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
              Prompt Expander <span className={`${theme.labelAccent} transition-colors duration-500`}>MK-II</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-stretch">
          
          {/* Input Section */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end px-2">
              <label className={`${theme.text} font-bold uppercase tracking-wider text-sm transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Input Concept
              </label>
              <div className={`${theme.text} text-xs font-mono font-bold transition-colors duration-500`}>CH-1</div>
            </div>
            
            {/* CRT Screen Container */}
            <div className="bg-[#1a0b00] p-4 md:p-6 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,1),0_4px_0_rgba(255,255,255,0.6)] border-[16px] border-[#2a2520] relative overflow-hidden group flex-grow flex flex-col min-h-[250px]">
              {/* Screen Glare */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-xl z-20"></div>
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-50"></div>
              
              <textarea 
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="e.g., a cat in space..."
                className="w-full flex-grow bg-transparent text-[#ffb000] font-mono text-lg resize-none outline-none placeholder-[#ffb000]/30 relative z-30 crt-scrollbar"
                style={{ textShadow: '0 0 8px rgba(255,176,0,0.6)' }}
                spellCheck={false}
                disabled={isGenerating}
              />
              
              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-[#1a0b00]/80 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="text-[#ffb000] font-mono flex flex-col items-center gap-3" style={{ textShadow: '0 0 10px rgba(255,176,0,0.8)' }}>
                    <div className="flex gap-2 mb-2">
                      <div className="w-3 h-3 bg-[#ffb000] shadow-[0_0_8px_#ffb000] animate-pulse rounded-sm" style={{ animationDuration: '0.8s' }}></div>
                      <div className="w-3 h-3 bg-[#ffb000] shadow-[0_0_8px_#ffb000] animate-pulse rounded-sm" style={{ animationDuration: '0.8s', animationDelay: '200ms' }}></div>
                      <div className="w-3 h-3 bg-[#ffb000] shadow-[0_0_8px_#ffb000] animate-pulse rounded-sm" style={{ animationDuration: '0.8s', animationDelay: '400ms' }}></div>
                    </div>
                    <span className="animate-pulse font-bold tracking-widest text-sm">ENCODING DATA...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Script Templates */}
            {generationMode === 'Script' && (
              <div className="flex flex-col gap-2 mt-2 px-2">
                <div className={`${theme.text} text-[10px] font-bold uppercase tracking-wider transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                  Load Pre-Defined Template
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(scriptTemplates) as Array<keyof typeof scriptTemplates>).map(genre => (
                    <button
                      key={genre}
                      onClick={() => applyTemplate(genre)}
                      className="relative outline-none group"
                    >
                      <div className="absolute inset-0 bg-[#111] opacity-50 rounded translate-y-1"></div>
                      <div className={`relative py-1 px-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider rounded border border-black/20 transition-all duration-300 bg-gradient-to-b ${theme.btnBase} shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] group-active:translate-y-1 group-hover:brightness-110`}>
                        <span className="leading-none pt-px">{genre}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Center Action Button */}
          <div className="flex justify-center lg:flex-col gap-8 items-center py-8">
            {/* Mode Switcher */}
            <div className={`flex flex-col gap-2 items-center w-full max-w-[200px]`}>
              <div className={`${theme.text} text-[10px] font-bold uppercase tracking-widest transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Target Media
              </div>
              <div className="flex w-full bg-[#111] p-1.5 rounded-xl border border-black/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] relative">
                {/* Active Slider */}
                <div 
                  className={`absolute top-1.5 bottom-1.5 w-[calc(33.333%-4px)] rounded-lg shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    generationMode === 'Image' ? 'left-1.5 bg-[#444]' : generationMode === 'Video' ? 'left-[calc(33.333%+2px)] bg-[#444]' : 'left-[calc(66.666%-2px)] bg-[#444]'
                  }`}
                  style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))` }}
                >
                  <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${generationMode !== 'Image' ? theme.ledBtn : 'bg-red-500 shadow-[0_0_5px_#ff0000,inset_0_1px_1px_rgba(255,255,255,0.8)]'}`} />
                </div>
                
                {['Image', 'Video', 'Script'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setGenerationMode(mode as 'Image' | 'Video' | 'Script')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 relative z-10 ${
                      generationMode === mode 
                        ? `text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`
                        : `text-gray-500 hover:text-gray-300`
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className={`flex flex-col gap-3 items-center ${theme.panelBg} p-3 rounded-xl shadow-[inset_0_2px_5px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.6)] border w-full max-w-[200px] transition-colors duration-500`}>
              <div className={`${theme.panelText} text-[10px] font-bold uppercase tracking-widest transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Aesthetic Mode
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {[
                  { id: 'None', label: 'STD' },
                  { id: 'Retro 80s Electronics', label: 'RETRO' },
                  { id: '70s Woodgrain Hi-Fi', label: 'WOOD' },
                  { id: 'Brushed Heavy Metal', label: 'METAL' },
                  { id: 'Retro Digital Interface', label: 'DIGIT' },
                  { id: 'Brass & Leather', label: 'BRASS' },
                  { id: 'Bakelite Radio', label: 'RADIO' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className="relative outline-none group"
                  >
                    <div className="absolute inset-0 bg-[#111] opacity-50 rounded translate-y-1"></div>
                    <div className={`relative py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-black/20 transition-all duration-300 ${
                      selectedStyle === s.id
                        ? `bg-gradient-to-b ${theme.btnActive} translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`
                        : `bg-gradient-to-b ${theme.btnBase} shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] group-active:translate-y-1 group-hover:brightness-110`
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${selectedStyle === s.id ? theme.ledBtn : 'bg-black/30 shadow-inner'}`} />
                      <span className="truncate leading-none pt-px">{s.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className={`w-full h-px bg-black/20 my-1 shadow-[0_1px_0_rgba(255,255,255,0.2)]`} />
              
              <div className={`${theme.panelText} text-[10px] font-bold uppercase tracking-widest transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Texture
              </div>
              <div className="w-full relative">
                <select
                  value={selectedTexture}
                  onChange={(e) => setSelectedTexture(e.target.value)}
                  className={`w-full appearance-none bg-[#111] border border-black/40 rounded-lg px-2 py-1.5 text-[10px] uppercase font-bold text-center outline-none ${theme.text} shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.2)]`}
                >
                  <option value="Standard">Standard</option>
                  <option value="Cracked Paint">Cracked Paint</option>
                  <option value="Worn Leather">Worn Leather</option>
                  <option value="Polished Chrome">Polished Chrome</option>
                  <option value="Frosted Glass">Frosted Glass</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L0 0H8L4 6Z" />
                  </svg>
                </div>
              </div>

            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !inputPrompt.trim()}
              className={`relative group outline-none transition-all duration-200 ${isGenerating || !inputPrompt.trim() ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {/* Button Shadow/Base */}
              <div className={`absolute inset-0 bg-[#7a1b1b] rounded-2xl transition-transform duration-100 ${isGenerating ? 'translate-y-4' : 'translate-y-4 group-active:translate-y-1'}`}></div>
              {/* Button Top */}
              <div className={`relative bg-gradient-to-b from-[#ff4d4d] to-[#cc0000] border-2 border-[#990000] text-white font-bold py-8 px-8 rounded-2xl shadow-[inset_0_4px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.2)] transition-all duration-150 flex flex-col items-center gap-3 uppercase tracking-widest min-w-[160px] ${isGenerating ? 'translate-y-4 brightness-75 shadow-[inset_0_2px_0_rgba(0,0,0,0.4),0_0_15px_rgba(255,50,50,0.8)]' : 'group-active:translate-y-3 group-hover:brightness-110'}`}>
                {isGenerating ? (
                  <Loader2 size={40} className="animate-spin drop-shadow-md text-[#ffcccc]" />
                ) : (
                  <Sparkles size={40} className="drop-shadow-md" />
                )}
                <span className="drop-shadow-md text-lg">{isGenerating ? 'Processing' : 'Expand'}</span>
              </div>
            </button>

            {/* Decorative vents */}
            <div className="hidden lg:flex flex-col gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-16 h-2.5 bg-[#1a1a1a] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.5)]"></div>
              ))}
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-end px-2">
              <label className={`${theme.text} font-bold uppercase tracking-wider text-sm transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Expanded Output
              </label>
              <div className={`${theme.text} text-xs font-mono font-bold transition-colors duration-500`}>CH-2</div>
            </div>
            
            {/* CRT Screen Container */}
            <div className="bg-[#001a0b] p-4 md:p-6 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,1),0_4px_0_rgba(255,255,255,0.6)] border-[16px] border-[#202a25] relative overflow-hidden flex-grow flex flex-col min-h-[250px]">
              {/* Screen Glare */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-xl z-20"></div>
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-50"></div>
              
              {!generatedImageUrl ? (
                <div 
                  className="w-full flex-grow bg-transparent text-[#33ff33] font-mono text-lg overflow-y-auto relative z-30 crt-scrollbar whitespace-pre-wrap"
                  style={{ textShadow: '0 0 8px rgba(51,255,51,0.6)' }}
                >
                  {outputPrompt || (
                    <span className="opacity-30">Awaiting input...</span>
                  )}
                  {/* Blinking cursor effect */}
                  {!isGenerating && outputPrompt && <span className="animate-pulse">_</span>}
                </div>
              ) : (
                <div className="w-full flex-grow flex items-center justify-center relative z-30 p-2 max-h-[400px] overflow-hidden group">
                  <img src={generatedImageUrl} alt="Generated" className="max-w-full max-h-full object-contain rounded drop-shadow-[0_0_15px_rgba(51,255,51,0.4)] transition-transform duration-300 group-hover:scale-[1.02]" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => setZoomedImage(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded backdrop-blur-sm"
                  >
                    <ZoomIn size={48} className="text-[#33ff33] drop-shadow-[0_0_8px_#33ff33]" />
                  </button>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-[#001a0b]/80 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="text-[#33ff33] font-mono flex gap-4 flex-col items-center" style={{ textShadow: '0 0 10px rgba(51,255,51,0.8)' }}>
                    <div className="flex gap-2">
                      <div className="w-2 h-8 bg-[#33ff33] shadow-[0_0_8px_#33ff33] animate-pulse rounded-sm" style={{ animationDuration: '0.8s' }}></div>
                      <div className="w-2 h-6 bg-[#33ff33] shadow-[0_0_8px_#33ff33] animate-pulse rounded-sm mt-2" style={{ animationDuration: '0.8s', animationDelay: '100ms' }}></div>
                      <div className="w-2 h-10 bg-[#33ff33] shadow-[0_0_8px_#33ff33] animate-pulse rounded-sm -mt-2" style={{ animationDuration: '0.8s', animationDelay: '200ms' }}></div>
                      <div className="w-2 h-5 bg-[#33ff33] shadow-[0_0_8px_#33ff33] animate-pulse rounded-sm mt-3" style={{ animationDuration: '0.8s', animationDelay: '300ms' }}></div>
                      <div className="w-2 h-8 bg-[#33ff33] shadow-[0_0_8px_#33ff33] animate-pulse rounded-sm" style={{ animationDuration: '0.8s', animationDelay: '400ms' }}></div>
                    </div>
                    <span className="animate-pulse font-bold tracking-widest text-sm">RECEIVING SIGNAL...</span>
                  </div>
                </div>
              )}

              {isGeneratingImage && (
                <div className="absolute inset-0 z-40 bg-[#001a0b]/80 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="text-[#33ff33] font-mono flex flex-col items-center gap-4" style={{ textShadow: '0 0 10px rgba(51,255,51,0.8)' }}>
                    <div className="relative">
                      <Loader2 size={40} className="animate-spin text-[#33ff33] drop-shadow-[0_0_8px_#33ff33]" />
                      <div className="absolute inset-0 border-t-2 border-[#33ff33] rounded-full animate-ping opacity-50"></div>
                    </div>
                    <span className="animate-pulse font-bold tracking-widest text-sm">SYNTHESIZING IMAGE...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-2 items-center">
              {generationMode === 'Image' ? (
                <button 
                  onClick={handleGenerateImage}
                  disabled={!outputPrompt || isGeneratingImage}
                  className="relative group outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[#0e3b18] rounded-lg translate-y-2 group-active:translate-y-0 transition-transform duration-100"></div>
                  <div className="relative bg-gradient-to-b from-[#1c8033] to-[#125921] border-2 border-[#093512] text-[#33ff33] font-bold py-2 px-4 rounded-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.4)] group-active:translate-y-2 transition-transform duration-100 flex items-center gap-2 uppercase tracking-wide text-sm" style={{ textShadow: '0 0 5px rgba(51,255,51,0.6)' }}>
                    {isGeneratingImage ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isGeneratingImage ? 'Rendering...' : 'Render Image'}
                  </div>
                </button>
              ) : <div />}
              
              <div className="flex gap-3">
                {generatedImageUrl && (
                   <>
                    <button 
                      onClick={() => setGeneratedImageUrl(null)}
                      className="relative group outline-none"
                    >
                      <div className="absolute inset-0 bg-[#505050] rounded-lg translate-y-2 group-active:translate-y-0 transition-transform duration-100"></div>
                      <div className="relative bg-gradient-to-b from-[#8a8a8a] to-[#6b6b6b] border-2 border-[#4a4a4a] text-white font-bold py-2 px-4 rounded-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.2)] group-active:translate-y-2 transition-transform duration-100 flex items-center justify-center uppercase tracking-wide text-sm">
                        Text
                      </div>
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="relative group outline-none"
                    >
                      <div className="absolute inset-0 bg-[#0e3b1e] rounded-lg translate-y-2 group-active:translate-y-0 transition-transform duration-100"></div>
                      <div className="relative bg-gradient-to-b from-[#1c804b] to-[#125936] border-2 border-[#093522] text-[#33ff88] font-bold py-2 px-4 rounded-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.2)] group-active:translate-y-2 transition-transform duration-100 flex items-center gap-2 justify-center uppercase tracking-wide text-sm" style={{ textShadow: '0 0 5px rgba(51,255,136,0.6)' }}>
                        <Download size={16} />
                        DL
                      </div>
                    </button>
                   </>
                )}
                <button 
                  onClick={handleCopy}
                  disabled={!outputPrompt}
                  className="relative group outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[#505050] rounded-lg translate-y-2 group-active:translate-y-0 transition-transform duration-100"></div>
                  <div className="relative bg-gradient-to-b from-[#8a8a8a] to-[#6b6b6b] border-2 border-[#4a4a4a] text-white font-bold py-2 px-6 rounded-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.2)] group-active:translate-y-2 transition-transform duration-100 flex items-center gap-2 uppercase tracking-wide text-sm">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Parameter Matrix Bank */}
        <div className={`mt-8 ${theme.panelBg} p-6 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.4)] border transition-colors duration-500`}>
          <div className={`${theme.panelText} text-xs font-bold uppercase tracking-widest mb-4 transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.2)' }}>
            Render Parameters Matrix
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ParameterBank 
                label={generationMode === 'Script' ? 'Genre / Setting' : 'Sci-Fi Era / Subgenre'} 
                options={['Cyberpunk', 'Solarpunk', 'Retro-Futurism', 'Deep Space', 'Post-Apocalypse']} 
                value={selectedEra}
                onChange={setSelectedEra}
              />
              
              {generationMode === 'Script' ? (
                <>
                  <ParameterBank 
                    label="Format / Structure" 
                    options={['Film Scene', 'Cinematic Trailer', 'TV Cold Open', 'Game Cutscene', 'Short']} 
                    value={selectedFormat}
                    onChange={setSelectedFormat}
                  />
                  <ParameterBank 
                    label="Tone" 
                    options={['Dark & Gritty', 'Satirical', 'Hopeful', 'Suspenseful', 'Ethereal']} 
                    value={selectedTone}
                    onChange={setSelectedTone}
                  />
                  <ParameterBank 
                    label="Pacing" 
                    options={['Fast-Paced', 'Slow Burn', 'Frenetic', 'Deliberate']} 
                    value={selectedPacing}
                    onChange={setSelectedPacing}
                  />
                  <ParameterBank 
                    label="Dialogue Style" 
                    options={['Punchy & Witty', 'Naturalistic', 'Poetic', 'Sparse', 'Expositional']} 
                    value={selectedDialogue}
                    onChange={setSelectedDialogue}
                  />
                  <ParameterBank 
                    label="Action Intensity" 
                    options={['Realistic', 'Over-the-top', 'Slow-Mo Focus', 'Chaotic', 'Minimalist']} 
                    value={selectedAction}
                    onChange={setSelectedAction}
                  />
                  <ParameterBank 
                    label="Sound Design Emphasis" 
                    options={['Heavy Foley', 'Synth-Heavy Score', 'Dead Silence', 'Orchestral Sweep', 'Diegetic Only']} 
                    value={selectedSound}
                    onChange={setSelectedSound}
                  />
                  <ParameterBank 
                    label="Voice Profiles" 
                    options={['Distinct', 'Archetypal', 'Monotone', 'Quirky', 'Stoic']} 
                    value={selectedVoice}
                    onChange={setSelectedVoice}
                  />
                  <ParameterBank 
                    label="Sub-Plot Complexity" 
                    options={['Linear', 'Multi-thread', 'Minimal', 'Twisting', 'Episodic']} 
                    value={selectedSubplot}
                    onChange={setSelectedSubplot}
                  />
                  <ParameterBank 
                    label="Transitions" 
                    options={['Hard Cuts', 'Cross-fades', 'Match Cuts', 'Smash Cuts', 'Wipes']} 
                    value={selectedTransition}
                    onChange={setSelectedTransition}
                  />
                </>
              ) : (
                <>
                  <ParameterBank 
                    label="Lighting Setup" 
                    options={['Cinematic', 'Neon / Synthwave', 'Volumetric', 'High Contrast', 'Ethereal']} 
                    value={selectedLighting}
                    onChange={setSelectedLighting}
                  />
                  <ParameterBank 
                    label="Camera Perspective" 
                    options={['Wide-angle', 'Close-up / Macro', 'Isometric', 'Drone / Aerial', 'Dynamic Action']} 
                    value={selectedCamera}
                    onChange={setSelectedCamera}
                  />
                  <ParameterBank 
                    label="Artistic Medium" 
                    options={['Photorealistic', '3D Render', 'Digital Art', 'Oil Painting', 'Anime / Manga']} 
                    value={selectedMedium}
                    onChange={setSelectedMedium}
                  />
                  <ParameterBank 
                    label="Aspect Ratio" 
                    options={['16:9', '9:16', '1:1', '4:3', '21:9']} 
                    value={selectedAspectRatio}
                    onChange={setSelectedAspectRatio}
                  />
                  {generationMode === 'Video' && (
                    <>
                      <ParameterBank 
                        label="Camera Motion" 
                        options={['Static / Locked', 'Steady Pan', 'Tracking Shot', 'Handheld Drip', 'FPV Drone']} 
                        value={selectedMotion}
                        onChange={setSelectedMotion}
                      />
                      <ParameterBank 
                        label="Video Pacing" 
                        options={['Real-time', 'Slow Motion', 'Timelapse', 'Hyperlapse', 'Speed Ramp']} 
                        value={selectedPacing}
                        onChange={setSelectedPacing}
                      />
                      {generateAudio && (
                        <ParameterBank 
                          label="Sound Design Emphasis" 
                          options={['Heavy Foley', 'Synth-Heavy Score', 'Dead Silence', 'Orchestral Sweep', 'Diegetic Only']} 
                          value={selectedSound}
                          onChange={setSelectedSound}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Advanced Overrides */}
            <div className={`flex flex-col gap-4 pl-0 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l ${theme.text.replace('text', 'border')}/20 w-fit`}>
              <div className={`${theme.text} text-[10px] font-bold uppercase tracking-wider transition-colors duration-500`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                Advanced Overrides
              </div>
              <div className={`flex-1 flex flex-wrap justify-start items-center bg-black/5 p-4 rounded-xl border border-black/10 shadow-inner gap-4`}>
                <ToggleSwitch label="Noise" checked={advNoise} onChange={setAdvNoise} />
                <ToggleSwitch label="Glow" checked={advGlow} onChange={setAdvGlow} />
                <ToggleSwitch label="Texture" checked={advTexture} onChange={setAdvTexture} />
                {generationMode === 'Video' && (
                  <ToggleSwitch label="Audio" checked={generateAudio} onChange={setGenerateAudio} />
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Image View */}
      {zoomedImage && generatedImageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-8 flex items-center justify-center cursor-zoom-out backdrop-blur-md"
          onClick={() => setZoomedImage(false)}
        >
          <img src={generatedImageUrl} alt="Zoomed" className="max-w-full max-h-full object-contain drop-shadow-[0_0_40px_rgba(51,255,51,0.4)]" referrerPolicy="no-referrer" />
          <button 
            className="absolute top-6 right-6 text-white hover:text-[#33ff33] bg-black/60 rounded-full p-3 transition-colors border border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImage(false);
            }}
          >
            <X size={28} />
          </button>
          
          <button 
            className="absolute bottom-6 right-6 flex items-center gap-2 text-black bg-[#33ff33] hover:bg-[#66ff66] hover:shadow-[0_0_20px_#33ff33] font-bold rounded-full px-6 py-3 transition-all outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download size={20} />
            DOWNLOAD HIGH-RES
          </button>
        </div>
      )}
    </div>
  );
}
