
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRightCircle, Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedFlashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

interface FlashcardGeneratorProps {
  onFlashcardsGenerated?: (flashcards: GeneratedFlashcard[]) => void;
}

const FlashcardGenerator = ({ onFlashcardsGenerated }: FlashcardGeneratorProps) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();
  
  // Mock AI generation for now
  const generateFlashcards = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please provide some text to generate flashcards from.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate AI processing with progress
    const mockProcess = async () => {
      for (let i = 0; i <= 100; i += 5) {
        setGenerationProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Generate mock flashcards based on input length (in real app, this would be AI-generated)
      const numberOfCards = Math.max(3, Math.min(10, Math.floor(inputText.length / 50)));
      const mockFlashcards: GeneratedFlashcard[] = Array.from({ length: numberOfCards }).map((_, i) => ({
        id: `card-${Date.now()}-${i}`,
        front: `Sample Question ${i + 1} from your text?`,
        back: `Sample Answer ${i + 1} with an explanation.`,
        category: ['Concept', 'Definition', 'Process', 'Example'][Math.floor(Math.random() * 4)]
      }));
      
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(mockFlashcards);
      }
      
      toast({
        title: "Flashcards generated",
        description: `Successfully created ${mockFlashcards.length} flashcards.`
      });
      
      setIsGenerating(false);
      setInputText('');
    };
    
    await mockProcess();
  };
  
  return (
    <Card className="glass-card w-full max-w-3xl mx-auto p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Brain className="h-5 w-5" />
          <h3 className="text-xl">AI Flashcard Generator</h3>
        </div>
        
        <Textarea 
          placeholder="Paste your notes, textbook excerpts, or any learning material here..."
          className="min-h-32 text-base p-4 focus:ring-2 focus:ring-primary/50 transition-all"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="flex flex-col items-center gap-4">
          <Button 
            onClick={generateFlashcards}
            disabled={isGenerating || !inputText.trim()}
            className="w-full max-w-xs rounded-full py-6 shadow-md hover:shadow-lg transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Flashcards
                <ArrowRightCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="w-full mt-2">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Analyzing content and generating smart flashcards...
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FlashcardGenerator;
