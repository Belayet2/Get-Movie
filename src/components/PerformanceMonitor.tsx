import { useEffect } from "react";

// Define custom types for Web Vitals metrics
interface PerformanceMetrics {
  FCP: number;
  LCP: number;
  CLS: number;
  FID: number;
  TTFB: number;
}

// Define custom interface for LayoutShift entries
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

// Define custom interface for First Input entries
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and in the browser
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    // Initialize metrics object
    const metrics: Partial<PerformanceMetrics> = {};

    // Report metrics to console or analytics service
    const reportMetrics = () => {
      console.log("Performance Metrics:", metrics);

      // Here you would typically send these metrics to your analytics service
      // Example: sendToAnalytics(metrics);
    };

    // Measure First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries[entries.length - 1];
      metrics.FCP = fcpEntry.startTime;
      fcpObserver.disconnect();
    });
    fcpObserver.observe({ type: "paint", buffered: true });

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcpEntry = entries[entries.length - 1];
      metrics.LCP = lcpEntry.startTime;
      lcpObserver.disconnect();
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // Measure Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Cast to LayoutShiftEntry to access hadRecentInput and value
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      metrics.CLS = clsValue;
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0] as FirstInputEntry;
        metrics.FID = firstInput.processingStart - firstInput.startTime;
        fidObserver.disconnect();
      }
    });
    fidObserver.observe({ type: "first-input", buffered: true });

    // Measure Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0) {
      metrics.TTFB = (
        navigationEntries[0] as PerformanceNavigationTiming
      ).responseStart;
    }

    // Report metrics when the page is being unloaded
    window.addEventListener("beforeunload", reportMetrics);

    // Report metrics after 10 seconds if the page hasn't been unloaded
    const timeout = setTimeout(reportMetrics, 10000);

    return () => {
      window.removeEventListener("beforeunload", reportMetrics);
      clearTimeout(timeout);

      // Disconnect any remaining observers
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
