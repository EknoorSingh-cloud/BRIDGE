import { useState } from "react";

const INTERVIEWER_PROFILE = `
You are a Senior Software Engineer conducting a real interview for an entry-level role.

Rules:
- Ask ONE question at a time
- Briefly react to the candidate’s answer before moving on
- Use natural phrases like:
  "Okay", "Got it", "That makes sense", "Interesting"
- If the answer is vague, ask a follow-up
- Do NOT explain concepts unless asked
- Do NOT sound like a chatbot or tutor
- Keep the tone professional, calm, and realistic
- Speak like a human interviewer, not an AI
`;

function GeminiInterviewer() {
  // interview flow: intro → background → technical → scenario → wrap
  const [phase, setPhase] = useState("intro");

  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text:
            "Hi 👋 Thanks for joining today. Before we get into details, could you briefly introduce yourself?",
        },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const advancePhase = () => {
    setPhase((prev) => {
      if (prev === "intro") return "background";
      if (prev === "background") return "technical";
      if (prev === "technical") return "scenario";
      if (prev === "scenario") return "wrap";
      return "wrap";
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        parts: [{ text: input }],
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `
${INTERVIEWER_PROFILE}

Current interview phase: ${phase}

Phase intent:
- intro: ease the candidate in
- background: education, projects, motivation
- technical: core concepts and reasoning
- scenario: real-world situations and judgment
- wrap: reflection and closing

For every response:
1. Acknowledge the previous answer naturally
2. Ask the next relevant question
3. Avoid generic filler like "Let's continue"
`,
                },
              ],
            },
            contents: updatedMessages,
            generationConfig: {
              temperature: 0.55,
              maxOutputTokens: 140,
            },
          }),
        }
      );

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error("Empty Gemini response");
      }

      // small delay to avoid instant bot-like replies
      await new Promise((r) => setTimeout(r, 1100));

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: reply }],
        },
      ]);

      advancePhase();
    } catch (error) {
      console.error("Gemini error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text:
                "Alright. I didn’t fully catch that — could you clarify a bit?",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-2">
        Gemini AI Mock Interview
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Interview phase:{" "}
        <span className="capitalize">{phase}</span>
      </p>

      <div className="h-[420px] overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg leading-relaxed ${
              msg.role === "model"
                ? "bg-gray-800 text-gray-200"
                : "bg-green-600 text-white ml-auto"
            } max-w-[85%]`}
          >
            {msg.parts[0].text}
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 italic">
            Interviewer is thinking…
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          className="flex-1 p-3 rounded bg-gray-800 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default GeminiInterviewer;
