import { useEffect, useState } from "react";

// --- Defensive Browser Signal Collector ---
function safeGet(fn, fallback = null) {
  try {
    const value = fn();
    return value !== undefined ? value : fallback;
  } catch {
    return fallback;
  }
}

function collectBrowserSignals() {
  return {
    // Basic browser identity
    userAgent: safeGet(() => navigator.userAgent, "unknown"),
    platform: safeGet(() => navigator.platform, "unknown"),
    language: safeGet(() => navigator.language, "unknown"),
    languages: safeGet(() => navigator.languages, []),

    // Time & locale
    timezone: safeGet(() => Intl.DateTimeFormat().resolvedOptions().timeZone, "unknown"),
    localTime: safeGet(() => new Date().toLocaleString(), null),

    // Screen & device
    screenWidth: safeGet(() => window.screen.width, null),
    screenHeight: safeGet(() => window.screen.height, null),
    colorDepth: safeGet(() => window.screen.colorDepth, null),
    deviceMemory: safeGet(() => navigator.deviceMemory, null),
    hardwareConcurrency: safeGet(() => navigator.hardwareConcurrency, null),
    maxTouchPoints: safeGet(() => navigator.maxTouchPoints, 0),

    // Browser capabilities
    cookieEnabled: safeGet(() => navigator.cookieEnabled, false),
    doNotTrack: safeGet(() => navigator.doNotTrack, null),

    // Session-level info
    pageLoadTime: safeGet(() => new Date().toISOString(), null),
    referrer: safeGet(() => document.referrer || null, null),

    // Future-proofing: User-Agent Client Hints
    clientHints: {
      platform: safeGet(() => navigator.userAgentData?.platform, null),
      mobile: safeGet(() => navigator.userAgentData?.mobile, null),
      brands: safeGet(() => navigator.userAgentData?.brands, null)
    }
  };
}

// --- PsychicGreeter Component ---
export default function PsychicGreeter() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        // Collect all browser signals (A)
        const context = collectBrowserSignals();

        const response = await fetch(
          "https://psychic-greeter-api.azurewebsites.net/api/greeter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(context)
          }
        );

        const data = await response.json();
        setMessage(data.message);

        // Dramatic pause before reveal
        setTimeout(() => {
          setShowMessage(true);
          setLoading(false);
        }, 1500);

      } catch (err) {
        setMessage("The spirits are unusually quiet right now…");
        setShowMessage(true);
        setLoading(false);
      }
    }

    fetchGreeting();
  }, []);

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="max-w-xl text-center px-6">
        {loading && (
          <div className="text-gray-400 italic animate-pulse">
            Listening to the winds…
          </div>
        )}

        {!loading && showMessage && (
          <div className="text-xl text-gray-100 animate-fadeIn">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}