
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

const Layout = () => {
  return (
    <ErrorBoundary>
      <KeyboardShortcuts>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/98 to-card/40">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden bg-gradient-to-b from-transparent to-background/20">
                <div className="max-w-7xl mx-auto space-y-8">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </KeyboardShortcuts>
    </ErrorBoundary>
  );
};

export default Layout;
