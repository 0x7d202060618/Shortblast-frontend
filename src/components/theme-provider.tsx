"use client";

import React, { useEffect, useState } from "react";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ToastContainer } from "react-toastify";

import { Icon } from ".";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider {...props}>
      <ToastContainer
        theme={theme === "light" ? "light" : "dark"}
        icon={false}
        // autoClose={false}
        position="bottom-left"
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        closeButton={(props) => (
          <div onClick={props.closeToast}>
            <Icon name="close-circle" size={6} className="cursor-pointer" />
          </div>
        )}
      />
      {children}
    </NextThemesProvider>
  );
}
