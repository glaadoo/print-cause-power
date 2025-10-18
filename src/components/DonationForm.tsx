import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface DonationFormProps {
  selectedCause?: string;
  causeDetails?: {
    title: string;
    description: string;
  };
}

const DonationForm = ({ selectedCause, causeDetails }: DonationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const { error } = await supabase.from('donations').insert({
        donor_name: formData.donor_name,
        amount: parseFloat(formData.amount),
        cause: formData.cause,
        payment_method: formData.payment_method,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

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
  );
};

export default DonationForm;
