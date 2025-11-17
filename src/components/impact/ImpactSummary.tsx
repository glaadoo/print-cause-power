import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, ShoppingBag } from "lucide-react";

interface ImpactSummaryProps {
  totalDonated: number;
  causesSupported: number;
  ordersWithDonations: number;
}

export function ImpactSummary({ totalDonated, causesSupported, ordersWithDonations }: ImpactSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Donated</p>
              <p className="text-2xl md:text-3xl font-bold">${totalDonated.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Causes Supported</p>
              <p className="text-2xl md:text-3xl font-bold">{causesSupported}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Orders with Donations</p>
              <p className="text-2xl md:text-3xl font-bold">{ordersWithDonations}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
