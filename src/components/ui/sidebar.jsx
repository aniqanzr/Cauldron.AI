import React, { createContext, useContext, useState } from "react";
import { cn } from "@/utils"; // We created this earlier!
import { PanelLeft } from "lucide-react";

const SidebarContext = createContext({
  open: true,
  setOpen: () => {},
});

export function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="group/sidebar-wrapper flex min-h-screen w-full has-[[data-variant=inset]]:bg-sidebar">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children }) {
  const { open } = useContext(SidebarContext);
  return (
    <aside
      className={cn(
        "group/sidebar fixed inset-y-0 left-0 z-10 hidden h-svh w-[--sidebar-width] transition-[width] ease-linear md:flex",
        !open && "w-[0px]",
        className
      )}
    >
      <div className="flex h-full w-full flex-col bg-slate-50 border-r">
        {children}
      </div>
    </aside>
  );
}

export function SidebarTrigger({ className }) {
  const { open, setOpen } = useContext(SidebarContext);
  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn("p-2 hover:bg-slate-100 rounded-md", className)}
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}

// These are simple wrappers to make the Layout happy
export function SidebarHeader({ className, children }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function SidebarContent({ className, children }) {
  return <div className={cn("flex-1 overflow-auto p-2", className)}>{children}</div>;
}

export function SidebarGroup({ className, children }) {
  return <div className={cn("py-2", className)}>{children}</div>;
}

export function SidebarGroupContent({ className, children }) {
  return <div className={cn("w-full text-sm", className)}>{children}</div>;
}

export function SidebarMenu({ className, children }) {
  return <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({ className, children }) {
  return <li className={cn("group/menu-item relative", className)}>{children}</li>;
}

export function SidebarMenuButton({ asChild = false, isActive, className, children, ...props }) {
  // If asChild is true, we just render the child (usually a Link)
  const Comp = asChild ? "div" : "button"; 
  return (
    <Comp
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-slate-200 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        isActive && "bg-slate-200 font-medium text-black",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}