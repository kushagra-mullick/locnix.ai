import React from 'react';
import Navbar from '@/components/Navbar';
import Features from '@/components/Features';
import { Helmet } from 'react-helmet';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Features | Locnix.ai</title>
        <meta name="description" content="Explore all the powerful features of Locnix.ai's AI-powered flashcard platform" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 px-4">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Features</h1>
          
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-center text-gray-600 dark:text-gray-300">
              Discover how Locnix.ai's powerful features can transform your learning experience.
              Our AI-powered platform helps you create, study, and master flashcards more efficiently than ever.
            </p>
          </div>
          
          {/* Reuse the Features component from the homepage */}
          <Features />
          
          {/* Additional Feature Details */}
          <div className="mt-20 grid gap-16">
            <FeatureDetail 
              title="AI-Generated Flashcards" 
              description="Our advanced AI analyzes your content and automatically generates optimized flashcards that test true comprehension, not just memorization."
            />
            <FeatureDetail 
              title="Spaced Repetition System" 
              description="Our intelligent algorithm schedules reviews at the optimal time for maximum retention, helping you remember information for longer with less study time."
            />
            <FeatureDetail 
              title="Cross-Device Syncing" 
              description="Study seamlessly across all your devices. Start on your laptop and continue on your phone—your flashcards and progress are always in sync."
            />
            <FeatureDetail 
              title="Performance Analytics" 
              description="Gain insights into your learning patterns with detailed statistics and visualizations that help you track progress and identify areas for improvement."
            />
          </div>
        </div>
      </main>
      
      {/* Footer - Reuse existing footer from other pages */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Locnix.ai</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>dev.locnixai@gmail.com</li>
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

const FeatureDetail = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="glass-card p-8">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default FeaturesPage;
