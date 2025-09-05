import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { 
  SidebarContext, 
  SidebarProviderProps,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT
} from "./sidebar-types";

// =====================================================
// SIDEBAR PROVIDER COMPONENT (≤150 lines)
// =====================================================

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for controlled components.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // We get the sidebar state from the cookie.
    React.useEffect(() => {
      const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
        ?.split("=")[1];

      if (value === "true" || value === "false") {
        setOpen(value === "true");
      }
    }, [setOpen]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<
      React.ContextType<typeof SidebarContext>
    >(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);

SidebarProvider.displayName = "SidebarProvider";
