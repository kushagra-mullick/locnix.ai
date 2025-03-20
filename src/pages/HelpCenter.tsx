import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Help Center | Locnix.ai</title>
        <meta name="description" content="Get help and support for using Locnix.ai's AI-powered flashcard platform" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 px-4">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Help Center</h1>
          
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-center text-gray-600 dark:text-gray-300">
              Find answers to common questions about using Locnix.ai. Can't find what you're looking for? 
              Contact us at <a href="mailto:dev.locnixai@gmail.com" className="text-primary">dev.locnixai@gmail.com</a>
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="mb-12">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">How do I create flashcards?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  <p>There are several ways to create flashcards on Locnix.ai:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    <li>Use our AI generator by pasting text or uploading a document</li>
                    <li>Create flashcards manually through your dashboard</li>
                    <li>Import existing flashcards from other platforms</li>
                  </ol>
                  <p className="mt-2">Once created, your flashcards will automatically be organized and scheduled for review.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">How does the AI flashcard generator work?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes your content to identify key concepts and relationships, then creates flashcards that test true understanding rather than simple memorization. The AI considers factors like complexity, importance, and learning context when generating cards.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium">What is spaced repetition?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Spaced repetition is a learning technique where review sessions are scheduled at increasing intervals. Information you find difficult appears more frequently, while material you know well appears less often. This optimizes your study time and strengthens long-term memory.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">How do I sync my flashcards across devices?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Syncing happens automatically when you sign in with the same account. Your flashcards, progress, and settings will be available on any device where you use Locnix.ai.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium">Can I share my flashcards with others?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Yes! You can share individual flashcards or entire decks with other Locnix.ai users. Look for the share button in your dashboard to generate a shareable link.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">Our support team is ready to assist you with any questions or issues.</p>
              <a 
                href="mailto:dev.locnixai@gmail.com" 
                className="inline-block bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Locnix.ai</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link to="/about-us" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link to="/help-center" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/tutorials" className="hover:text-primary transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-primary transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="mailto:dev.locnixai@gmail.com" className="hover:text-primary transition-colors">
                    dev.locnixai@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Locnix.ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

import { Link } from 'react-router-dom';
export default HelpCenter;
