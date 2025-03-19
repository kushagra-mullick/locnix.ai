
import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cookie Policy - Locnix.ai</title>
        <meta name="description" content="Cookie Policy for Locnix.ai, the AI-powered flashcard platform." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose max-w-none dark:prose-invert">
          <h2>1. Introduction</h2>
          <p>This Cookie Policy explains how Locnix.ai ("we", "us", or "our") uses cookies and similar technologies on our website and application. By using our Service, you consent to the use of cookies as described in this policy.</p>
          
          <h2>2. What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent" or "session" cookies.</p>
          
          <h2>3. Types of Cookies We Use</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be switched off in our systems. They are usually set in response to actions you take such as logging in or filling in forms.</li>
            <li><strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.</li>
            <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
            <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other sites.</li>
          </ul>
          
          <h2>4. Third-Party Cookies</h2>
          <p>Some cookies are placed by third parties on our website. These third parties may include analytics providers, advertising networks, and social media platforms. We do not control how these third parties use cookies, so we suggest you check their websites for more information.</p>
          
          <h2>5. How to Control Cookies</h2>
          <p>Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "Options" or "Preferences" menu of your browser. You can:</p>
          <ul>
            <li>Delete all cookies that are already on your device</li>
            <li>Choose whether to accept cookies when you visit our site</li>
            <li>Set your browser to prevent cookies from being set</li>
          </ul>
          <p>Please note that if you choose to block cookies, some features of our website may not function properly.</p>
          
          <h2>6. Cookies in Our AI-Powered Features</h2>
          <p>Our AI flashcard generation features may use cookies and similar technologies to improve the accuracy and personalization of your flashcards. These technologies help us understand how you interact with the AI-generated content to continually improve our algorithms.</p>
          
          <h2>7. Updates to This Cookie Policy</h2>
          <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page and, if the changes are significant, we will provide a more prominent notice.</p>
          
          <h2>8. Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us at cookies@locnix.ai.</p>
          
          <p className="mt-8">Last Updated: March 18, 2025</p>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;
