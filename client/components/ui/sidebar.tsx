// =====================================================
// SIDEBAR MAIN EXPORT (≤50 lines)
// =====================================================

// Export all sidebar components and utilities
export { useSidebar } from "./sidebar-types";
export { SidebarProvider } from "./sidebar-provider";
export { Sidebar, SidebarTrigger } from "./sidebar-core";
export { SidebarRail } from "./sidebar-rail";
export {
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "./sidebar-components";
export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar-group";
export {
  SidebarMenu,
  SidebarMenuItem,
} from "./sidebar-menu";
export {
  SidebarMenuButton,
  SidebarMenuAction,
} from "./sidebar-menu-button";
export {
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar-menu-extended";

// Export types
export type {
  SidebarContext,
  SidebarProps,
  SidebarProviderProps,
  SidebarMenuButtonProps,
  SidebarMenuSubButtonProps,
} from "./sidebar-types";
