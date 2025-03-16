
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/20 filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute left-1/4 top-1/2 h-72 w-72 rounded-full bg-accent/20 filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 bottom-1/4 h-56 w-56 rounded-full bg-purple-400/20 filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Tag line */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Smart Flashcards
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight max-w-3xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Learn Smarter, Not Harder with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Locnix.ai
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Generate personalized flashcards with AI that adapts to your learning style. Study efficiently and remember more with our cutting-edge platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/study">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <StatCard
              icon={<Brain className="w-10 h-10 text-primary" />}
              title="AI-Powered"
              description="Generate perfect flashcards with our advanced AI"
            />
            <StatCard
              icon={<Zap className="w-10 h-10 text-amber-500" />}
              title="Learn Faster"
              description="Optimize your study time with our smart algorithms"
            />
            <StatCard
              icon={<Sparkles className="w-10 h-10 text-accent" />}
              title="Remember More"
              description="Retain information longer with spaced repetition"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center group">
      <div className="mb-4 transform transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Hero;
