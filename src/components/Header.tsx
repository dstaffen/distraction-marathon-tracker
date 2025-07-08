
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Media Tracker</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Welcome back!
        </div>
      </div>
    </header>
  );
}
