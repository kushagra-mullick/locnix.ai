
import React, { useState } from 'react';
import { Check, Lock, Crown, CreditCard, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { stripePromise, createCheckoutSession, processAlternativePayment } from '@/services/payment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PricingPlans = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    free: false,
    premium: false
  });
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'alternative'>('credit');
  const [parentEmail, setParentEmail] = useState('');

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're now using the free plan!",
        variant: "default",
      });
      return;
    }
    
    // For premium plan, show payment options
    setShowPaymentDialog(true);
  };
  
  const processPayment = async () => {
    setIsLoading(prev => ({ ...prev, premium: true }));
    
    try {
      if (paymentMethod === 'credit') {
        // In a real app, this would be your actual price ID from Stripe
        const priceId = 'price_1OxxxxxxxxxYOURPRICEID';
        const session = await createCheckoutSession(priceId);
        
        toast({
          title: "Redirecting to Checkout",
          description: "You'll be redirected to complete your purchase.",
          variant: "default",
        });
        
        // Simulate a redirect to Stripe Checkout
        console.log(`Redirecting to: ${session.url}`);
        
        // For demo purposes, show a toast instead of actual redirect
        setTimeout(() => {
          toast({
            title: "Demo Mode",
            description: "In a real app, you would be on the checkout page now. Since this is a demo, we're just showing this message.",
            variant: "default",
            duration: 5000,
          });
          setIsLoading(prev => ({ ...prev, premium: false }));
          setShowPaymentDialog(false);
        }, 1500);
      } else {
        // Process alternative payment
        const result = await processAlternativePayment('premium');
        
        if (result.success) {
          toast({
            title: "Alternative Payment Option Selected",
            description: "We've sent instructions to complete payment to your parent/guardian.",
            variant: "default",
            duration: 5000,
          });
          
          if (parentEmail) {
            toast({
              title: "Email Sent",
              description: `Payment instructions sent to ${parentEmail}`,
              variant: "default",
            });
          }
          
          setShowPaymentDialog(false);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, premium: false }));
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started for free or unlock premium features to supercharge your learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                Free Plan
              </CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">$0</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <CardDescription>Perfect for casual learners</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <Feature text="Create up to 50 flashcards" />
                <Feature text="Basic spaced repetition" />
                <Feature text="Text-only flashcards" />
                <LockedFeature text="AI-generated flashcards (Limited)" />
                <LockedFeature text="Performance analytics" />
                <LockedFeature text="Export to PDF" />
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe('free')} 
                className="w-full"
                disabled={isLoading.free}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="absolute top-5 right-5">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> RECOMMENDED
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                Premium Plan
                <Crown className="w-5 h-5 text-amber-500" />
              </CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <CardDescription>For serious learners and educators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <Feature text="Unlimited flashcards" />
                <Feature text="Advanced spaced repetition" />
                <Feature text="Rich media flashcards (images, audio)" />
                <Feature text="Unlimited AI-generated flashcards" />
                <Feature text="Detailed performance analytics" />
                <Feature text="Export to PDF, CSV, and more" />
                <Feature text="Collaborative decks" />
                <Feature text="Priority support" />
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="default" 
                onClick={() => handleSubscribe('premium')} 
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
                disabled={isLoading.premium}
              >
                {isLoading.premium ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-gray-500 max-w-2xl mx-auto">
          <p>All plans include our core learning features. Premium unlocks additional capabilities to enhance your learning experience.</p>
          <p className="mt-2">Multiple payment methods available including bank transfer and gift cards.</p>
        </div>
      </div>
      
      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select how you'd like to pay for your Premium Plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  className="h-4 w-4 border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" /> Credit Card (18+ or with parent permission)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="alternative"
                  name="payment-method"
                  checked={paymentMethod === 'alternative'}
                  onChange={() => setPaymentMethod('alternative')}
                  className="h-4 w-4 border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="alternative" className="flex items-center gap-2 cursor-pointer">
                  <Gift className="h-4 w-4" /> Parent/Guardian Payment
                </Label>
              </div>
              
              {paymentMethod === 'alternative' && (
                <div className="pt-2">
                  <Label htmlFor="parent-email">Parent/Guardian Email (optional)</Label>
                  <Input
                    id="parent-email"
                    type="email"
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send payment instructions to this email.
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={isLoading.premium}>
              {isLoading.premium ? "Processing..." : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </li>
);

const LockedFeature = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 text-gray-500">
    <Lock className="w-5 h-5 mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </li>
);

export default PricingPlans;
