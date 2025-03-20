import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';
import { PlayCircle, FileText, BookOpen } from 'lucide-react';

const Tutorials = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Tutorials | Locnix.ai</title>
        <meta name="description" content="Learn how to use Locnix.ai with our comprehensive tutorials" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 px-4">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Tutorials</h1>
          
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-center text-gray-600 dark:text-gray-300">
              Master Locnix.ai with our comprehensive tutorials. From basic setup to advanced features,
              we'll help you get the most out of your learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TutorialCard 
              title="Getting Started with Locnix.ai" 
              description="Learn the basics of creating an account, navigating the dashboard, and generating your first flashcards."
              type="video"
              estimatedTime="5 min"
            />
            <TutorialCard 
              title="AI Flashcard Generation" 
              description="Master the art of creating perfect flashcards using our AI generator with different types of content."
              type="article"
              estimatedTime="7 min"
            />
            <TutorialCard 
              title="Optimizing Your Study Schedule" 
              description="Learn how to set up and customize your study schedule for maximum retention and efficiency."
              type="guide"
              estimatedTime="10 min"
            />
            <TutorialCard 
              title="Advanced Flashcard Techniques" 
              description="Discover advanced techniques for creating more effective flashcards that promote deeper understanding."
              type="video"
              estimatedTime="8 min"
            />
            <TutorialCard 
              title="Using Analytics to Improve" 
              description="Understand how to interpret and use your performance data to continually improve your learning."
              type="article"
              estimatedTime="6 min"
            />
            <TutorialCard 
              title="Collaborative Learning Features" 
              description="Learn how to share and collaborate on flashcard sets with classmates or study groups."
              type="guide"
              estimatedTime="4 min"
            />
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Can't find what you need?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Check our <a href="/help-center" className="text-primary hover:underline">Help Center</a> or 
              contact us at <a href="mailto:dev.locnixai@gmail.com" className="text-primary hover:underline">dev.locnixai@gmail.com</a>
            </p>
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

const TutorialCard = ({ 
  title, 
  description, 
  type, 
  estimatedTime 
}: { 
  title: string; 
  description: string; 
  type: 'video' | 'article' | 'guide'; 
  estimatedTime: string; 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-6 h-6 text-primary" />;
      case 'article':
        return <FileText className="w-6 h-6 text-primary" />;
      case 'guide':
        return <BookOpen className="w-6 h-6 text-primary" />;
      default:
        return <FileText className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {getIcon()}
        <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{type}</span>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{estimatedTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <button className="text-primary hover:underline mt-auto">Read more</button>
    </div>
  );
};

export default Tutorials;
