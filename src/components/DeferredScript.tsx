import React, { useEffect, useState } from "react";

interface DeferredScriptProps {
  src: string;
  id?: string;
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
  strategy?: "afterInteractive" | "afterPaint" | "onIdle";
}

const DeferredScript: React.FC<DeferredScriptProps> = ({
  src,
  id,
  async = true,
  defer = true,
  onLoad,
  strategy = "afterInteractive",
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Skip if already loaded
    if (loaded) return;

    // Function to load the script
    const loadScript = () => {
      // Check if script already exists
      if (id && document.getElementById(id)) {
        setLoaded(true);
        onLoad?.();
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = src;
      if (id) script.id = id;
      if (async) script.async = true;
      if (defer) script.defer = true;

      // Handle load event
      script.onload = () => {
        setLoaded(true);
        onLoad?.();
      };

      // Append to document
      document.body.appendChild(script);
    };

    // Load based on strategy
    if (strategy === "afterInteractive") {
      // Load after the page becomes interactive
      if (document.readyState === "complete") {
        loadScript();
      } else {
        window.addEventListener("load", loadScript);
        return () => window.removeEventListener("load", loadScript);
      }
    } else if (strategy === "afterPaint") {
      // Load after first paint using requestAnimationFrame
      requestAnimationFrame(() => {
        setTimeout(loadScript, 0);
      });
    } else if (strategy === "onIdle") {
      // Load when browser is idle
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(loadScript);
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(loadScript, 1000);
      }
    }
  }, [src, id, async, defer, onLoad, strategy, loaded]);

  // This component doesn't render anything
  return null;
};

export default DeferredScript;
