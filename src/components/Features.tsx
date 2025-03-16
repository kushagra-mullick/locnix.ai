
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Brain, Sparkles, Clock, BarChart, 
  Share2, Zap, Lightbulb, LayoutGrid 
} from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with proven learning techniques to create the most effective flashcard experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain />}
            title="AI-Generated Flashcards"
            description="Transform any text into perfectly formatted flashcards with our intelligent AI that understands context and importance."
            delay={0}
          />
          <FeatureCard 
            icon={<Sparkles />}
            title="Smart Learning"
            description="Our system adapts to your learning style and performance, prioritizing cards you need to review most."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Clock />}
            title="Spaced Repetition"
            description="Based on cognitive science, our system schedules reviews at optimal intervals to maximize long-term retention."
            delay={0.2}
          />
          <FeatureCard 
            icon={<BarChart />}
            title="Performance Analytics"
            description="Track your progress with detailed insights into your study habits and knowledge retention."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Share2 />}
            title="Collaborative Learning"
            description="Share and study with friends, classmates, or study groups to enhance your learning experience."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Zap />}
            title="Fast Creation"
            description="Generate comprehensive flashcard sets in seconds, saving you hours of manual work."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Lightbulb />}
            title="Concept Connections"
            description="Our AI identifies relationships between concepts, helping you build a complete mental model."
            delay={0.6}
          />
          <FeatureCard 
            icon={<LayoutGrid />}
            title="Organized Collections"
            description="Keep your flashcards neatly organized by subject, topic, and difficulty level."
            delay={0.7}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <Card className="glass-card h-full p-6 flex flex-col items-start transition-all duration-300 animate-slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </Card>
  );
};

export default Features;
