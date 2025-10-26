import { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  UserCircle,
  Bell,
  Heart,
  Gift,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface AccountMenuProps {
  user: User;
  notificationCount?: number;
  activeOrderCount?: number;
}

export function AccountMenu({ user, notificationCount = 0, activeOrderCount = 0 }: AccountMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ first_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, avatar_url")
        .eq("user_id", user.id)
        .single();
      
      if (data) setProfile(data);
    };
    
    fetchProfile();
  }, [user.id]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
      toast({
        title: "Signed out successfully",
      });
    }
  };

  const getInitials = () => {
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/account" },
    { icon: Package, label: "My Orders", href: "/account/orders", badge: activeOrderCount > 0 ? `${activeOrderCount} active` : undefined },
    { icon: UserCircle, label: "My Info", href: "/account/info" },
    { icon: Bell, label: "Notifications", href: "/account/notifications", badge: notificationCount > 0 ? notificationCount : undefined },
    { icon: Heart, label: "Notify Me List", href: "/account/notify-me" },
    { icon: Gift, label: "Gift Cards", href: "/account/gift-cards" },
    { icon: Heart, label: "My Donations", href: "/account/donations" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || user.email || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          {notificationCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Hi, {profile?.first_name || "there"}!
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link to={item.href} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
