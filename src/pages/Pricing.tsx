
import React from 'react';
import Navbar from '@/components/Navbar';
import PricingPlans from '@/components/PricingPlans';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing Plans - Locnix.ai | Free & Premium Flashcard Options</title>
        <meta name="description" content="Choose between Locnix.ai's free and premium flashcard plans. Get started for free or upgrade for unlimited AI-generated flashcards and advanced features." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Flexible Plans for Every Learner
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your journey with our free plan and upgrade when you're ready to access premium features.
            </p>
          </div>
        </section>
        
        {/* Pricing Plans */}
        <PricingPlans />
        
        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              <FaqItem 
                question="What's included in the free plan?"
                answer="The free plan includes up to 50 flashcards, basic spaced repetition algorithms, and text-only cards. It's perfect for casual learners or those who want to try the platform before committing."
              />
              
              <FaqItem 
                question="Can I upgrade or downgrade my plan anytime?"
                answer="Yes! You can upgrade to Premium at any time. If you downgrade to the free plan, you'll maintain access to all your flashcards, but some premium features will no longer be available."
              />
              
              <FaqItem 
                question="Are there any discounts for educators or students?"
                answer="Yes, we offer special discounts for educational institutions. Contact our support team with your academic email for more information."
              />
              
              <FaqItem 
                question="How are AI-generated flashcards limited in the free plan?"
                answer="Free users can generate up to 15 AI flashcards per month. Premium users get unlimited AI-generated flashcards with more advanced customization options."
              />
            </div>
            
            <div className="text-center mt-12">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* We'll use the existing footer from the main page */}
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3">{question}</h3>
      <p className="text-gray-600 dark:text-gray-300">{answer}</p>
    </div>
  );
};

export default Pricing;
