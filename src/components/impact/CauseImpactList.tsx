import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";

interface Cause {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  totalDonated: number;
  donationCount: number;
}

interface CauseImpactListProps {
  causes: Cause[];
}

export function CauseImpactList({ causes }: CauseImpactListProps) {
  if (causes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Causes You've Supported</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            You haven't supported any causes yet. Make your first donation to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxDonation = Math.max(...causes.map(c => c.totalDonated));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Causes You've Supported</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {causes.map((cause) => (
            <Card key={cause.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{cause.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {cause.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Your contribution</span>
                        <span className="font-semibold">${cause.totalDonated.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(cause.totalDonated / maxDonation) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {cause.donationCount} {cause.donationCount === 1 ? 'donation' : 'donations'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
