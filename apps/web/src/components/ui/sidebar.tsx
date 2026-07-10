import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "hidden h-screen min-h-0 border-r border-border bg-surface dark:bg-card md:sticky md:top-0 md:flex md:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("shrink-0 border-b border-border p-5", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("space-y-3 border-t border-border p-4", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav data-slot="sidebar-menu" className={cn("space-y-1 p-4", className)} {...props} />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-menu-item" className={cn("min-w-0", className)} {...props} />
  );
}

function SidebarMenuButton({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-button"
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
};
