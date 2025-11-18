import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Heart, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyData {
  month: string;
  donations: number;
  amount: number;
  causes: number;
}

interface CauseData {
  name: string;
  amount: number;
  count: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyData, setYearlyData] = useState<MonthlyData[]>([]);
  const [causeData, setCauseData] = useState<CauseData[]>([]);
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");

  const COLORS = [
    'hsl(18 75% 55%)',
    'hsl(35 50% 75%)',
    'hsl(145 60% 42%)',
    'hsl(25 45% 85%)',
    'hsl(18 80% 65%)',
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all donations
      const { data: donations } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: true });

      if (donations) {
        // Process monthly data
        const monthlyMap = new Map<string, { amount: number; count: number; causes: Set<string> }>();
        const yearlyMap = new Map<string, { amount: number; count: number; causes: Set<string> }>();
        const causeMap = new Map<string, { amount: number; count: number }>();

        donations.forEach((donation) => {
          const date = new Date(donation.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          const yearKey = date.getFullYear().toString();

          // Monthly aggregation
          if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, { amount: 0, count: 0, causes: new Set() });
          }
          const monthData = monthlyMap.get(monthKey)!;
          monthData.amount += Number(donation.amount);
          monthData.count += 1;
          monthData.causes.add(donation.cause);

          // Yearly aggregation
          if (!yearlyMap.has(yearKey)) {
            yearlyMap.set(yearKey, { amount: 0, count: 0, causes: new Set() });
          }
          const yearData = yearlyMap.get(yearKey)!;
          yearData.amount += Number(donation.amount);
          yearData.count += 1;
          yearData.causes.add(donation.cause);

          // Cause aggregation
          if (!causeMap.has(donation.cause)) {
            causeMap.set(donation.cause, { amount: 0, count: 0 });
          }
          const cause = causeMap.get(donation.cause)!;
          cause.amount += Number(donation.amount);
          cause.count += 1;
        });

        // Convert to array format for charts
        const monthlyArray = Array.from(monthlyMap.entries())
          .map(([month, data]) => ({
            month: new Date(month).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            donations: data.count,
            amount: Math.round(data.amount),
            causes: data.causes.size,
          }))
          .slice(-12); // Last 12 months

        const yearlyArray = Array.from(yearlyMap.entries())
          .map(([year, data]) => ({
            month: year,
            donations: data.count,
            amount: Math.round(data.amount),
            causes: data.causes.size,
          }));

        const causeArray = Array.from(causeMap.entries())
          .map(([name, data]) => ({
            name,
            amount: Math.round(data.amount),
            count: data.count,
          }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        setMonthlyData(monthlyArray);
        setYearlyData(yearlyArray);
        setCauseData(causeArray);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = timeframe === "monthly" ? monthlyData : yearlyData;
  
  const totalDonations = currentData.reduce((sum, item) => sum + item.donations, 0);
  const totalAmount = currentData.reduce((sum, item) => sum + item.amount, 0);
  const totalCauses = Math.max(...currentData.map(item => item.causes), 0);
  const avgDonation = totalDonations > 0 ? Math.round(totalAmount / totalDonations) : 0;

  const growthRate = currentData.length >= 2
    ? ((currentData[currentData.length - 1].amount - currentData[currentData.length - 2].amount) / currentData[currentData.length - 2].amount * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Donation Analytics</h1>
            <p className="text-muted-foreground">Track donation trends, growth, and community impact</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                <Heart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalDonations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeframe === "monthly" ? "Last 12 months" : "All time"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</div>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {growthRate > 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`} from last period
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Causes Supported</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalCauses}</div>
                <p className="text-xs text-muted-foreground mt-1">Active causes</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Donation</CardTitle>
                <DollarSign className="h-4 w-4 text-highlight" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${avgDonation}</div>
                <p className="text-xs text-muted-foreground mt-1">Per donation</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "monthly" | "yearly")} className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
              <TabsTrigger value="yearly">Yearly View</TabsTrigger>
            </TabsList>

            <TabsContent value={timeframe} className="space-y-6">
              {/* Donation Amount Trend */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Donation Amount Trend</CardTitle>
                  <CardDescription>Total donations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={currentData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(18 75% 55%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(18 75% 55%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="amount" stroke="hsl(18 75% 55%)" fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Donation Count vs Causes */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Donations vs Causes Supported</CardTitle>
                  <CardDescription>Number of donations and active causes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="donations" stroke="hsl(145 60% 42%)" strokeWidth={2} name="Donations" />
                      <Line type="monotone" dataKey="causes" stroke="hsl(35 50% 75%)" strokeWidth={2} name="Causes" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly/Yearly Comparison */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Growth Comparison</CardTitle>
                  <CardDescription>Period-over-period donation amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="amount" fill="hsl(18 75% 55%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Cause Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Top Causes by Amount</CardTitle>
                <CardDescription>Distribution of donations across causes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={causeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="hsl(18 75% 55%)"
                      dataKey="amount"
                    >
                      {causeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Cause Rankings</CardTitle>
                <CardDescription>Top performing causes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {causeData.map((cause, index) => (
                    <div key={cause.name} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" 
                        style={{ backgroundColor: COLORS[index % COLORS.length], color: 'white' }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-foreground">{cause.name}</span>
                          <span className="text-sm font-bold text-foreground">${cause.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{cause.count} donations</span>
                          <span>${Math.round(cause.amount / cause.count)} avg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
