import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | Locnix.ai</title>
        <meta name="description" content="Learn more about Locnix.ai's mission to transform learning through AI-powered flashcards" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 px-4">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-8">About Locnix.ai</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-4xl">
            <p className="lead">
              Locnix.ai was founded with a simple mission: make learning more efficient and effective through the power of AI.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Story</h2>
            <p>
              As students and lifelong learners ourselves, we experienced firsthand the challenges of traditional study methods. 
              Creating effective flashcards was time-consuming, and existing solutions didn't adapt to individual learning styles.
            </p>
            <p>
              We built Locnix.ai to solve these problems by combining cutting-edge AI with proven learning science principles like 
              spaced repetition and active recall. Our platform automatically generates high-quality flashcards tailored to your 
              learning style and adapts to your progress over time.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Team</h2>
            <p>
              Our team brings together expertise in artificial intelligence, educational psychology, and user experience design. 
              We're passionate about creating tools that make learning more accessible and effective for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Values</h2>
            <ul>
              <li><strong>Learning First:</strong> Every decision we make is guided by what's best for learners.</li>
              <li><strong>Innovation:</strong> We continuously explore new technologies and approaches to improve the learning experience.</li>
              <li><strong>Accessibility:</strong> We believe effective learning tools should be available to everyone.</li>
              <li><strong>Privacy:</strong> We respect your data and maintain the highest standards of privacy and security.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
            <p>
              We'd love to hear from you! Reach out to us at <a href="mailto:dev.locnixai@gmail.com" className="text-primary">dev.locnixai@gmail.com</a>
            </p>
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
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
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

export default AboutUs;
