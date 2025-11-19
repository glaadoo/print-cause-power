import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { PressmasterQuoteModal } from "./PressmasterQuoteModal";
import { requestPressmasterQuote, PressmasterQuoteResponse } from "@/services/pressmaster.service";
import { z } from "zod";

const donationSchema = z.object({
  donor_name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  amount: z.number()
    .positive("Amount must be positive")
    .min(1, "Minimum donation is $1")
    .max(1000000, "Maximum donation is $1,000,000"),
  cause: z.string()
    .min(1, "Please select a cause"),
  payment_method: z.enum(["credit_card", "paypal", "bank_transfer"], {
    errorMap: () => ({ message: "Please select a payment method" })
  })
});

interface DonationFormProps {
  selectedCause?: string;
  causeDetails?: {
    title: string;
    description: string;
  };
}

const DonationForm = ({ selectedCause, causeDetails }: DonationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPressmasterModal, setShowPressmasterModal] = useState(false);
  const [pressmasterQuote, setPressmasterQuote] = useState<PressmasterQuoteResponse | null>(null);
  const [lastDonationId, setLastDonationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    donor_name: "",
    amount: "",
    cause: selectedCause || "",
    payment_method: ""
  });

  useEffect(() => {
    if (selectedCause) {
      setFormData(prev => ({ ...prev, cause: selectedCause }));
    }
  }, [selectedCause]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input before submitting
      const validation = donationSchema.safeParse({
        donor_name: formData.donor_name,
        amount: parseFloat(formData.amount),
        cause: formData.cause,
        payment_method: formData.payment_method
      });

      if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const validatedData = validation.data;

      const { data: insertedData, error } = await supabase
        .from('donations')
        .insert({
          donor_name: validatedData.donor_name,
          amount: validatedData.amount,
          cause: validatedData.cause,
          payment_method: validatedData.payment_method,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const donationAmount = parseFloat(formData.amount);
      
      // Check for $777 Check-Drop automation
      if (donationAmount >= 777 && insertedData) {
        try {
          const quote = await requestPressmasterQuote({
            project: 'Print Power Purpose',
            specs: 'Check-drop storytelling package',
            quantity: 1,
            donationId: insertedData.id,
          });
          
          setPressmasterQuote(quote);
          setLastDonationId(insertedData.id);
          
          toast({
            title: "🎉 $777 Check Drop Triggered!",
            description: "Pressmaster story generated - click to view",
            action: (
              <Button size="sm" onClick={() => setShowPressmasterModal(true)}>
                View Story
              </Button>
            ),
          });
        } catch (error) {
          console.error('Failed to trigger Pressmaster automation:', error);
        }
      }

      toast({
        title: "Thank you!",
        description: `Your donation of $${formData.amount} has been received.`,
      });

      setFormData({
        donor_name: "",
        amount: "",
        cause: "",
        payment_method: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-highlight" />
            <CardTitle>Make a Donation</CardTitle>
          </div>
          <CardDescription>
            {causeDetails ? (
              <>
                <span className="font-semibold text-foreground">{causeDetails.title}</span>
                <br />
                {causeDetails.description}
              </>
            ) : (
              "Support a cause you care about"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="donor_name">Name</Label>
              <Input
                id="donor_name"
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                required
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="50.00"
              />
            </div>

            <div>
              <Label htmlFor="cause">Cause</Label>
              <Select
                value={formData.cause}
                onValueChange={(value) => setFormData({ ...formData, cause: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cause" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="poverty">Poverty Relief</SelectItem>
                  <SelectItem value="animals">Animal Welfare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Donate Now"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <PressmasterQuoteModal
        open={showPressmasterModal}
        onOpenChange={setShowPressmasterModal}
        donationId={lastDonationId || undefined}
        readOnly={true}
        existingQuote={pressmasterQuote || undefined}
      />
    </>
  );
};

export default DonationForm;
