import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let tools: any[] = [];
    let toolChoice: any = undefined;

    if (type === "flashcards") {
      systemPrompt = `You are an expert educator. Analyze the provided study material and generate flashcards from it. 
      Create meaningful question-answer pairs that help students learn key concepts. 
      Extract the main topics, definitions, important facts, and relationships from the content.
      Generate between 5-15 flashcards depending on the content length.`;
      
      tools = [
        {
          type: "function",
          function: {
            name: "generate_flashcards",
            description: "Generate flashcards from study material",
            parameters: {
              type: "object",
              properties: {
                flashcards: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string", description: "The question for the flashcard" },
                      answer: { type: "string", description: "The answer to the question" },
                      subject: { type: "string", description: "The subject/topic category" },
                    },
                    required: ["question", "answer", "subject"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["flashcards"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "generate_flashcards" } };
    } else if (type === "quiz") {
      systemPrompt = `You are an expert educator. Analyze the provided study material and create a quiz from it.
      Generate multiple-choice questions that test understanding of the key concepts.
      Each question should have 4 options with exactly one correct answer.
      Create between 5-10 questions depending on the content.`;
      
      tools = [
        {
          type: "function",
          function: {
            name: "generate_quiz",
            description: "Generate quiz questions from study material",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "A title for the quiz based on the content" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string", description: "The quiz question" },
                      options: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Four possible answers" 
                      },
                      correct_answer: { type: "string", description: "The correct answer (must be one of the options)" },
                      explanation: { type: "string", description: "Brief explanation of why this is correct" },
                    },
                    required: ["question", "options", "correct_answer"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title", "questions"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "generate_quiz" } };
    } else {
      throw new Error("Invalid type. Must be 'flashcards' or 'quiz'");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this study material and generate ${type}:\n\n${content}` },
        ],
        tools,
        tool_choice: toolChoice,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No content generated");
    }

    const generatedContent = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
