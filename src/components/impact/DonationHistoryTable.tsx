import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface Donation {
  id: string;
  amount: number;
  cause_name: string;
  created_at: string;
  order_number: string | null;
}

interface DonationHistoryTableProps {
  donations: Donation[];
}

export function DonationHistoryTable({ donations }: DonationHistoryTableProps) {
  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No donations yet. Make your first donation to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Related Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="text-sm">
                    {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="font-medium">{donation.cause_name}</TableCell>
                  <TableCell className="text-primary font-semibold">
                    ${donation.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {donation.order_number ? (
                      <span className="font-mono text-sm">{donation.order_number}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Direct donation</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="font-semibold">Total Donated:</span>
          <span className="text-xl font-bold text-primary">${totalDonated.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
