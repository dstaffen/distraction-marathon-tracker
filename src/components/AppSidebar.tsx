
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  List, 
  Book, 
  ChartBar,
  LogOut
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Add Entry", url: "/app/add-entry", icon: Plus },
  { title: "Categories", url: "/app/categories", icon: List },
  { title: "Blog", url: "/app/blog", icon: Book },
  { title: "Analytics", url: "/app/analytics", icon: ChartBar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path === "/app/dashboard" && currentPath === "/app");

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-gradient-to-b from-sidebar-background to-sidebar-background/95 backdrop-blur-sm">
      <SidebarHeader className="p-4 border-b border-sidebar-border/40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
            <Book className="h-5 w-5 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text text-transparent">
                MediaTracker
              </h2>
              <p className="text-sm text-sidebar-foreground/70 font-medium">Personal Media Hub</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium tracking-wide text-xs uppercase mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="group relative overflow-hidden transition-all duration-300 rounded-lg hover:bg-sidebar-accent/60 data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-accent data-[active=true]:to-sidebar-accent/60 data-[active=true]:shadow-sm data-[active=true]:border data-[active=true]:border-sidebar-border/30"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 w-full">
                      <div className={`transition-colors duration-300 ${
                        isActive(item.url) 
                          ? 'text-sidebar-primary' 
                          : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
                      }`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className={`font-medium transition-colors duration-300 ${
                        isActive(item.url)
                          ? 'text-sidebar-primary font-semibold'
                          : 'text-sidebar-foreground group-hover:text-sidebar-foreground'
                      }`}>
                        {item.title}
                      </span>
                      {isActive(item.url) && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sidebar-primary to-sidebar-primary/60 rounded-r-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/40">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-10 hover:bg-sidebar-accent/60 transition-all duration-300 rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {state === "expanded" && <span className="font-medium">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
