import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PressmasterModeBadge } from "./PressmasterModeBadge";
import { requestPressmasterQuote, PressmasterQuoteResponse } from "@/services/pressmaster.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PressmasterQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donationId?: string;
  readOnly?: boolean;
  existingQuote?: PressmasterQuoteResponse;
}

export const PressmasterQuoteModal = ({
  open,
  onOpenChange,
  donationId,
  readOnly = false,
  existingQuote,
}: PressmasterQuoteModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<PressmasterQuoteResponse | null>(existingQuote || null);
  
  const [formData, setFormData] = useState({
    project: "Print Power Purpose",
    specs: "",
    quantity: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await requestPressmasterQuote({
        ...formData,
        donationId,
      });

      setQuote(result);
      toast({
        title: `Pressmaster (${result.mock ? 'Stub' : 'Live'}): Quote ready`,
        description: `$${result.quote.amount} ${result.quote.currency} - ${result.turnaround}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get quote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Pressmaster Quote</DialogTitle>
            {quote && <PressmasterModeBadge isLive={!quote.mock} />}
          </div>
          <DialogDescription>
            {readOnly
              ? "View quote details"
              : "Request a quote for custom print products"}
          </DialogDescription>
        </DialogHeader>

        {!readOnly && !quote ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project/Cause</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs">Specifications</Label>
              <Textarea
                id="specs"
                value={formData.specs}
                onChange={(e) =>
                  setFormData({ ...formData, specs: e.target.value })
                }
                placeholder="Describe the product specifications..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Quote...
                </>
              ) : (
                "Get Quote"
              )}
            </Button>
          </form>
        ) : quote ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-2xl font-bold">
                  ${quote.quote.amount} {quote.quote.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Turnaround:</span>
                <span className="text-sm">{quote.turnaround}</span>
              </div>
              {quote.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{quote.notes}</p>
                </div>
              )}
            </div>

            {!readOnly && (
              <Button
                onClick={() => setQuote(null)}
                variant="outline"
                className="w-full"
              >
                Request New Quote
              </Button>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
