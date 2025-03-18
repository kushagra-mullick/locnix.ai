
import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy - Locnix.ai</title>
        <meta name="description" content="Privacy Policy for Locnix.ai, the AI-powered flashcard platform." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none dark:prose-invert">
          <h2>1. Introduction</h2>
          <p>This Privacy Policy explains how Locnix.ai ("we", "us", or "our") collects, uses, and shares your personal information when you use our AI-powered flashcard platform.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account (name, email address, password)</li>
            <li>Create and study flashcards (content of your cards, study history)</li>
            <li>Provide content for AI generation (text you input for generating flashcards)</li>
            <li>Contact customer support</li>
          </ul>
          
          <p>We also automatically collect certain information about your device and usage, including:</p>
          <ul>
            <li>Device information (operating system, browser type)</li>
            <li>Usage data (how you interact with the application)</li>
            <li>Performance data (errors, loading times)</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Service</li>
            <li>Improve the flashcard generation algorithm</li>
            <li>Personalize your experience with spaced repetition</li>
            <li>Communicate with you about your account or the Service</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
          
          <h2>4. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul>
            <li>Service providers who help us operate the platform</li>
            <li>Analytics partners to understand how our Service is used</li>
            <li>Legal authorities when required by law</li>
          </ul>
          
          <h2>5. AI and Your Data</h2>
          <p>When you use our AI flashcard generation feature:</p>
          <ul>
            <li>We process the text you provide to generate flashcards</li>
            <li>We may use anonymized data to improve our AI models</li>
            <li>You maintain ownership of your original content and generated flashcards</li>
          </ul>
          
          <h2>6. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no internet transmission is completely secure, so we cannot guarantee the absolute security of your data.</p>
          
          <h2>7. Data Retention</h2>
          <p>We retain your information as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.</p>
          
          <h2>8. Children's Privacy</h2>
          <p>Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us.</p>
          
          <h2>9. Your Rights</h2>
          <p>Depending on your location, you may have rights regarding your personal information, including:</p>
          <ul>
            <li>Accessing your data</li>
            <li>Correcting inaccurate data</li>
            <li>Deleting your data</li>
            <li>Restricting or objecting to certain processing</li>
            <li>Data portability</li>
          </ul>
          
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          
          <h2>11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@locnix.ai.</p>
          
          <p className="mt-8">Last Updated: March 18, 2025</p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
