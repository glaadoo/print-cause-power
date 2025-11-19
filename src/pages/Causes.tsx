import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Heart, Leaf, Users, TrendingUp, DollarSign, Award, Search, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const causeSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s&'-]+$/, "Name contains invalid characters"),
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  tags: z.string()
    .trim()
    .max(200, "Tags must be less than 200 characters")
    .optional(),
  website_url: z.string()
    .trim()
    .refine(
      (url) => !url || url.startsWith('http://') || url.startsWith('https://'),
      "URL must start with http:// or https://"
    )
    .refine(
      (url) => {
        if (!url) return true;
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      "Must be a valid URL"
    )
    .optional()
});

interface CauseStats {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  tags: string | null;
  website_url: string | null;
  total_raised: number;
  donation_count: number;
  unique_donors: number;
  avg_donation: number;
}

const causeIcons: Record<string, any> = {
  education: GraduationCap,
  healthcare: Heart,
  environment: Leaf,
  community: Users,
};

const causeColors: Record<string, string> = {
  education: "from-primary to-primary/70",
  healthcare: "from-highlight to-highlight/70",
  environment: "from-accent to-accent/70",
  community: "from-secondary to-secondary/70",
};

const impactStories: Record<string, { title: string; story: string; impact: string }> = {
  education: {
    title: "Empowering the Next Generation",
    story: "Through your generous donations, we've provided scholarships to over 500 students, giving them access to quality education and brighter futures.",
    impact: "500+ students supported with scholarships and educational materials"
  },
  healthcare: {
    title: "Healing Communities",
    story: "Your contributions have enabled free medical camps in underserved areas, providing essential healthcare services to thousands of families.",
    impact: "10,000+ patients received free medical care and medications"
  },
  environment: {
    title: "Protecting Our Planet",
    story: "Together, we've planted over 50,000 trees and cleaned up coastal areas, creating a sustainable future for generations to come.",
    impact: "50,000+ trees planted and 100+ beaches cleaned"
  },
  community: {
    title: "Building Stronger Communities",
    story: "Your support has helped build community centers, provide job training, and create safe spaces where people can connect and thrive.",
    impact: "15 community centers built and 2,000+ people trained"
  }
};

const Causes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [causeStats, setCauseStats] = useState<CauseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [newCause, setNewCause] = useState({
    name: "",
    description: "",
    tags: "",
    website_url: "",
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCauseStats();
  }, []);

  const fetchCauseStats = async () => {
    try {
      setLoading(true);
      // Fetch all causes
      const { data: causes } = await supabase
        .from('causes')
        .select('*')
        .order('name');

      if (!causes) return;

      // Fetch donation statistics for each cause
      const statsPromises = causes.map(async (cause) => {
        const { data: donations } = await supabase
          .from('donations')
          .select('amount, user_id')
          .eq('cause_id', cause.id);

        if (!donations || donations.length === 0) {
          return {
            ...cause,
            donation_count: 0,
            unique_donors: 0,
            avg_donation: 0,
          };
        }

        const uniqueDonors = new Set(donations.map(d => d.user_id)).size;
        const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        const avgDonation = totalAmount / donations.length;

        return {
          ...cause,
          total_raised: totalAmount,
          donation_count: donations.length,
          unique_donors: uniqueDonors,
          avg_donation: avgDonation,
        };
      });

      const stats = await Promise.all(statsPromises);
      setCauseStats(stats);
    } catch (error) {
      console.error('Error fetching cause stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (causeName: string) => {
    navigate('/donations', { 
      state: { 
        selectedCause: causeName.toLowerCase(),
        causeDetails: {
          title: causeName,
          description: causeStats.find(c => c.name.toLowerCase() === causeName.toLowerCase())?.description
        }
      } 
    });
  };

  const handleAddCause = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add a cause.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Validate input before submitting
    const validation = causeSchema.safeParse({
      name: newCause.name,
      description: newCause.description,
      tags: newCause.tags || "",
      website_url: newCause.website_url || ""
    });

    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    const validatedData = validation.data;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('causes').insert({
        name: validatedData.name,
        description: validatedData.description,
        tags: validatedData.tags || null,
        website_url: validatedData.website_url || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Cause added successfully!",
        description: "Your cause has been added and will appear shortly.",
      });

      setIsAddDialogOpen(false);
      setNewCause({ name: "", description: "", tags: "", website_url: "" });
      fetchCauseStats();
    } catch (error: any) {
      console.error('Error adding cause:', error);
      toast({
        title: "Error adding cause",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCauses = causeStats.filter((cause) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cause.name.toLowerCase().includes(query) ||
      cause.description?.toLowerCase().includes(query) ||
      cause.tags?.toLowerCase().includes(query)
    );
  });

  const showAddCauseCTA = searchQuery.length > 0 && filteredCauses.length === 0;
  const maxDonation = Math.max(...causeStats.map(c => c.total_raised || 0), 1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="bg-gradient-secondary bg-clip-text text-transparent">Causes</span>
            </h1>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
              Every purchase you make contributes to meaningful change. Explore the causes we support and see the real impact your contributions are making in communities around the world.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search causes by name, keywords, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-base"
              />
            </div>
            
            {/* Add Cause CTA */}
            {showAddCauseCTA && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50 flex items-center justify-between">
                <p className="text-sm text-foreground/70">Can't find your cause?</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add it here
                </Button>
              </div>
            )}
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">
                  ${causeStats.reduce((sum, c) => sum + (c.total_raised || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-foreground/60">Total Raised</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-highlight mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">
                  {causeStats.reduce((sum, c) => sum + c.donation_count, 0)}
                </p>
                <p className="text-sm text-foreground/60">Total Donations</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">
                  {causeStats.length}
                </p>
                <p className="text-sm text-foreground/60">Active Causes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Causes Detail Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {filteredCauses.length === 0 && !showAddCauseCTA ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No causes found</h3>
              <p className="text-muted-foreground">Try another keyword or add a new cause.</p>
            </div>
          ) : (
            <Tabs defaultValue={filteredCauses[0]?.name.toLowerCase()} className="w-full">
              <TabsList className="mb-8 w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
                {filteredCauses.map((cause) => {
                const Icon = causeIcons[cause.name.toLowerCase()] || Heart;
                return (
                  <TabsTrigger 
                    key={cause.id} 
                    value={cause.name.toLowerCase()}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {cause.name}
                  </TabsTrigger>
                );
                })}
              </TabsList>

              {filteredCauses.map((cause) => {
              const Icon = causeIcons[cause.name.toLowerCase()] || Heart;
              const gradient = causeColors[cause.name.toLowerCase()] || "from-primary to-primary/70";
              const story = impactStories[cause.name.toLowerCase()];
              const progress = (cause.total_raised / maxDonation) * 100;

              return (
                <TabsContent key={cause.id} value={cause.name.toLowerCase()} className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Cause Card */}
                    <Card className="lg:col-span-2 glass-card">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{cause.name}</CardTitle>
                            <p className="text-foreground/70">{cause.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Impact Story */}
                        {story && (
                          <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-border/50">
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Award className="w-5 h-5 text-primary" />
                              {story.title}
                            </h3>
                            <p className="text-foreground/70 mb-4">{story.story}</p>
                            <div className="bg-background/50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-primary">{story.impact}</p>
                            </div>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-foreground/60">Fundraising Progress</span>
                            <span className="text-sm font-semibold text-foreground">
                              ${cause.total_raised?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        <Button 
                          onClick={() => handleDonate(cause.name)}
                          className="w-full"
                          size="lg"
                        >
                          Donate to {cause.name}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Statistics Sidebar */}
                    <div className="space-y-4">
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="border-b border-border/50 pb-4">
                            <p className="text-sm text-foreground/60 mb-1">Total Raised</p>
                            <p className="text-2xl font-bold text-primary">
                              ${cause.total_raised?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div className="border-b border-border/50 pb-4">
                            <p className="text-sm text-foreground/60 mb-1">Total Donations</p>
                            <p className="text-2xl font-bold text-foreground">
                              {cause.donation_count}
                            </p>
                          </div>
                          <div className="border-b border-border/50 pb-4">
                            <p className="text-sm text-foreground/60 mb-1">Unique Donors</p>
                            <p className="text-2xl font-bold text-foreground">
                              {cause.unique_donors}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Average Donation</p>
                            <p className="text-2xl font-bold text-foreground">
                              ${cause.avg_donation?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                        <CardContent className="p-6 text-center">
                          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                          <p className="text-sm font-semibold mb-2">Make a Difference</p>
                          <p className="text-xs text-foreground/70 mb-4">
                            Your contribution, no matter the size, creates real impact
                          </p>
                          <Button 
                            onClick={() => handleDonate(cause.name)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Support This Cause
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              );
              })}
            </Tabs>
          )}
        </div>
      </section>

      {/* Add Cause Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Cause</DialogTitle>
            <DialogDescription>
              Create a new cause to help make a difference. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cause-name">Cause Name *</Label>
              <Input
                id="cause-name"
                placeholder="e.g., Clean Water Initiative"
                value={newCause.name}
                onChange={(e) => setNewCause({ ...newCause, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cause-description">Description *</Label>
              <Textarea
                id="cause-description"
                placeholder="Describe the cause and its impact..."
                value={newCause.description}
                onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cause-tags">Tags (optional)</Label>
              <Input
                id="cause-tags"
                placeholder="e.g., water, health, community"
                value={newCause.tags}
                onChange={(e) => setNewCause({ ...newCause, tags: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cause-website">Website URL (optional)</Label>
              <Input
                id="cause-website"
                type="url"
                placeholder="https://..."
                value={newCause.website_url}
                onChange={(e) => setNewCause({ ...newCause, website_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCause} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Cause"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Causes;
