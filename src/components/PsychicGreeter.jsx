import { useEffect, useState } from "react";

export default function PsychicGreeter() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        // Browser context
        const context = {
          localTime: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        };

        const response = await fetch("https://psychic-greeter-api.azurewebsites.net/api/greeter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context)
        });

        const data = await response.json();

        setMessage(data.message);
      } catch (err) {
        setMessage("The spirits are unusually quiet right now…");
      } finally {
        setLoading(false);
      }
    }

    fetchGreeting();
  }, []);

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="max-w-xl text-center px-6">
        {loading ? (
          <div className="text-gray-400 italic animate-pulse">
            Listening to the winds…
          </div>
        ) : (
          <div className="text-xl text-gray-100 animate-fadeIn will-change-opacity">
            {message}
          </div>

        )}
      </div>
    </div>
  );
}
