
import { useFlashcards } from '../context/FlashcardContext';
import type { Flashcard } from '../types/flashcard';

export const useFlashcardOperations = () => {
  const flashcardContext = useFlashcards();
  
  const createFlashcard = (front: string, back: string, category?: string) => {
    flashcardContext.addFlashcard({
      front,
      back,
      category
    });
  };
  
  const createFlashcardsFromBatch = (flashcardData: { front: string, back: string, category?: string }[]) => {
    flashcardContext.addFlashcards(flashcardData);
  };
  
  const studySession = (count: number = 10) => {
    return flashcardContext.getFlashcardsForStudy(count);
  };
  
  const recordFlashcardRating = (id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    flashcardContext.rateFlashcard(id, difficulty);
  };
  
  const deleteFlashcard = (id: string) => {
    flashcardContext.deleteFlashcard(id);
  };
  
  const exportFlashcards = () => {
    // Convert to a simpler format for export, removing IDs and dates
    const exportData = flashcardContext.flashcards.map(card => ({
      front: card.front,
      back: card.back,
      category: card.category || "",
      difficulty: card.difficulty
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create download link and trigger click
    const exportFileDefaultName = `flashcards-export-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const importFlashcards = (jsonData: string): { success: boolean; message: string; count?: number } => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!Array.isArray(parsedData)) {
        return { success: false, message: "Invalid format. Expected an array of flashcards." };
      }
      
      // Validate each flashcard has the required fields
      const validFlashcards = parsedData.filter(card => 
        typeof card === 'object' && card !== null && 
        typeof card.front === 'string' && card.front.trim() !== '' &&
        typeof card.back === 'string' && card.back.trim() !== ''
      );
      
      if (validFlashcards.length === 0) {
        return { success: false, message: "No valid flashcards found in the file." };
      }
      
      // Format flashcards for import
      const flashcardsToImport = validFlashcards.map(card => ({
        front: card.front.trim(),
        back: card.back.trim(),
        category: typeof card.category === 'string' ? card.category.trim() : undefined,
        difficulty: ['easy', 'medium', 'hard'].includes(card.difficulty) ? card.difficulty as 'easy' | 'medium' | 'hard' : undefined
      }));
      
      // Add flashcards to context
      flashcardContext.addFlashcards(flashcardsToImport);
      
      return { 
        success: true, 
        message: `Successfully imported ${flashcardsToImport.length} flashcards.`,
        count: flashcardsToImport.length
      };
    } catch (error) {
      console.error("Error importing flashcards:", error);
      return { success: false, message: "Failed to parse the file. Make sure it's a valid JSON file." };
    }
  };
  
  return {
    ...flashcardContext,
    createFlashcard,
    createFlashcardsFromBatch,
    studySession,
    recordFlashcardRating,
    deleteFlashcard,
    exportFlashcards,
    importFlashcards
  };
};
