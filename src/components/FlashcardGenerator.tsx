
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

const API_KEY = "sk-your-key"; // This is a placeholder. In production, use environment variables.

const FlashcardGenerator = ({ onFlashcardsGenerated }: FlashcardGeneratorProps) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();
  
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
    
    try {
      // Simulate progress while waiting for API response
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 100);
      
      // Define the prompt for the LLM
      const prompt = `
        Create flashcards from the following text. 
        For each important concept or fact, create a flashcard with a question on the front and answer on the back.
        Return in this JSON format:
        [{"front": "...", "back": "...", "category": "..."}]
        Categories should be one of: Concept, Definition, Process, Example, Fact
        Text: ${inputText}
      `;
      
      // Use either the user-provided API key or the default one
      const keyToUse = apiKey || API_KEY;
      
      // Make the API call to generate flashcards
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keyToUse}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator who creates high-quality flashcards for effective learning.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the response to get flashcards
      let flashcards;
      try {
        // Find JSON in the response (in case the AI wrapped it in text)
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          flashcards = JSON.parse(jsonMatch[0]);
        } else {
          flashcards = JSON.parse(content);
        }
      } catch (error) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Failed to parse AI response");
      }
      
      // Add IDs to the flashcards
      const flashcardsWithIds = flashcards.map((card: any, index: number) => ({
        ...card,
        id: `card-${Date.now()}-${index}`
      }));
      
      setGenerationProgress(100);
      
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(flashcardsWithIds);
      }
      
      toast({
        title: "Flashcards generated",
        description: `Successfully created ${flashcardsWithIds.length} flashcards.`
      });
      
      // If we're in development mode without a real API key, fall back to mock data
      if (keyToUse === "sk-your-key") {
        const mockFlashcards: GeneratedFlashcard[] = Array.from({ length: 5 }).map((_, i) => ({
          id: `card-${Date.now()}-${i}`,
          front: `What is concept ${i + 1} from your text?`,
          back: `This is the explanation for concept ${i + 1}.`,
          category: ['Concept', 'Definition', 'Process', 'Example', 'Fact'][Math.floor(Math.random() * 5)]
        }));
        
        if (onFlashcardsGenerated) {
          onFlashcardsGenerated(mockFlashcards);
        }
        
        toast({
          title: "Using mock data",
          description: "No API key provided. Generated mock flashcards instead."
        });
      }
      
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setInputText('');
    }
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
        
        {/* Optional API Key input for users to provide their own key */}
        <div className="text-sm">
          <label htmlFor="api-key" className="block mb-1 text-gray-700 dark:text-gray-300">
            API Key (optional)
          </label>
          <input
            id="api-key"
            type="password"
            placeholder="Paste your OpenAI API key here (optional)"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            If not provided, we'll use our demo key with limited usage.
          </p>
        </div>
        
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
