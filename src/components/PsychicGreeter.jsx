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

  // ⭐ NEW — debug toggle + debug data
  const [debugVisible, setDebugVisible] = useState(false);
  const [debugData, setDebugData] = useState(null);

  // ⭐ NEW — keyboard listener for debug overlay
  useEffect(() => {
    function handleKey(e) {
      // Toggle with ~ or Ctrl+D
      if (e.key === "`" || (e.ctrlKey && e.key === "d")) {
        setDebugVisible(v => !v);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        // Collect all browser signals (A)
        const context = collectBrowserSignals();

        const response = await fetch(
          "https://psychic-greeter-api.azurewebsites.net/api/greeter",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(context)
          }
        );

        const data = await response.json();
        setMessage(data.message);

        // ⭐ NEW — store context for debug overlay
        setDebugData(data.context);

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
    <>
      {/* Main UI */}
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

      {/* ⭐ NEW — CRT Debug Overlay */}
      {debugVisible && (
        <pre
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            padding: "12px",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#00FF00",
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.3",
            maxWidth: "40vw",
            maxHeight: "90vh",
            overflow: "auto",
            borderRight: "1px solid #003300",
            borderBottom: "1px solid #003300",
            zIndex: 99999,
            whiteSpace: "pre-wrap",
            backgroundImage:
              "linear-gradient(rgba(0,255,0,0.05) 50%, transparent 50%)",
            backgroundSize: "100% 2px"
          }}
        >
          {JSON.stringify(debugData, null, 2)}
        </pre>
      )}
    </>
  );
}