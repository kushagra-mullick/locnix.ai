
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, X, Check } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { FlashcardData } from '@/context/FlashcardContext';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfUploaderProps {
  onExtractComplete: (flashcards: FlashcardData[]) => void;
  onClose: () => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onExtractComplete, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Clean up the URL when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      extractTextFromPdf(selectedFile);
    } else if (selectedFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
    }
  };

  const extractTextFromPdf = async (pdfFile: File) => {
    setIsLoading(true);
    setExtractedText('');
    setProgress(0);
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = '';
      
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / totalPages) * 100));
      }
      
      setExtractedText(fullText);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast({
        title: "PDF extraction failed",
        description: "There was an error extracting text from the PDF.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processPdfContent = async () => {
    if (!extractedText) return;
    
    setIsProcessing(true);
    
    try {
      // In a real application, this would be an API call to an AI service
      // Here we're simulating the AI processing with a timeout and simple text analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple simulation of AI-generated flashcards from text
      const sentences = extractedText
        .split(/[.!?]/)
        .filter(sentence => sentence.trim().length > 20)
        .slice(0, 10);
      
      const generatedFlashcards: FlashcardData[] = sentences.map((sentence, index) => {
        // Simple logic to extract a question from the sentence
        const words = sentence.trim().split(' ');
        const half = Math.floor(words.length / 2);
        
        const front = words.slice(0, half).join(' ') + '...?';
        const back = sentence.trim();
        
        const categories = ['PDF Extract', 'Auto-Generated'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        return {
          front,
          back,
          category: randomCategory
        };
      });
      
      onExtractComplete(generatedFlashcards);
      
      toast({
        title: "Flashcards created",
        description: `Successfully created ${generatedFlashcards.length} flashcards from your PDF.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error processing PDF content:', error);
      toast({
        title: "Processing failed",
        description: "Failed to generate flashcards from the PDF content.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        
        <div className="flex space-x-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            variant="outline"
          >
            <FileText className="mr-2 h-4 w-4" />
            {file ? 'Change PDF' : 'Select PDF'}
          </Button>
          
          {file && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-red-500"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        
        <Button
          onClick={processPdfContent}
          disabled={!extractedText || isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>
      
      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* PDF Preview */}
          <Card className="glass-card overflow-hidden h-96">
            <CardContent className="p-0 h-full">
              {previewUrl && (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              )}
            </CardContent>
          </Card>
          
          {/* Extracted Text Preview */}
          <Card className="glass-card overflow-hidden h-96">
            <CardContent className="p-4 h-full overflow-auto">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">Extracting text: {progress}%</p>
                </div>
              ) : extractedText ? (
                <div>
                  <h3 className="font-medium mb-2">Extracted Text</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {extractedText}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>Extracted text will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
