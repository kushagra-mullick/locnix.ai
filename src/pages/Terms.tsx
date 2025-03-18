
import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service - Locnix.ai</title>
        <meta name="description" content="Terms of Service for Locnix.ai, the AI-powered flashcard platform." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Locnix.ai (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          
          <h2>2. Description of Service</h2>
          <p>Locnix.ai is an AI-powered flashcard platform that helps users create, manage, and study flashcards using various learning techniques including spaced repetition.</p>
          
          <h2>3. User Accounts</h2>
          <p>To use certain features of the Service, you must register for an account. You agree to provide accurate and complete information when creating your account and to update such information to keep it accurate and current.</p>
          
          <h2>4. User Content</h2>
          <p>The Service may allow you to create, upload, or share content. You retain all rights to your content, but grant Locnix.ai a non-exclusive, worldwide, royalty-free license to use, copy, and process your content for the purpose of providing and improving the Service.</p>
          
          <h2>5. AI-Generated Content</h2>
          <p>The Service uses artificial intelligence to generate content based on user inputs. While we strive for accuracy, we cannot guarantee that AI-generated content will be free from errors or suitable for any specific purpose. Users should review and verify all AI-generated content.</p>
          
          <h2>6. Prohibited Uses</h2>
          <p>You agree not to use the Service for any unlawful purpose or in any way that could damage or impair the Service. Prohibited uses include but are not limited to: violating intellectual property rights, spreading malware, attempting to gain unauthorized access to the Service, or using the Service to generate harmful content.</p>
          
          <h2>7. Termination</h2>
          <p>Locnix.ai reserves the right to terminate or suspend your account at any time for any reason without notice. Upon termination, your right to use the Service will immediately cease.</p>
          
          <h2>8. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind, either express or implied. Locnix.ai does not warrant that the Service will be uninterrupted or error-free.</p>
          
          <h2>9. Limitation of Liability</h2>
          <p>In no event shall Locnix.ai be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.</p>
          
          <h2>10. Changes to Terms</h2>
          <p>Locnix.ai reserves the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and/or by providing additional notice as appropriate.</p>
          
          <h2>11. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Locnix.ai operates, without regard to its conflict of law provisions.</p>
          
          <h2>12. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at support@locnix.ai.</p>
          
          <p className="mt-8">Last Updated: March 18, 2025</p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
