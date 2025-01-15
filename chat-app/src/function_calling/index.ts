import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENI_API_KEY,
});

function getDateAndTime() {
  const date = new Date();
  return date.toLocaleString();
}

const callOpenAIWithFunctionCalling = async () => {
  const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "Act like a cool bro",
    },
    {
      role: "user",
      content: "what is date and time right now ?",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getDateAndTime",
          description: "Get the current date and time ",
        },
      },
    ],
    tool_choice: "auto",
  });

  console.log("First response :", response.choices[0].message.content);

  const shouldInvokeFunction =
    response.choices[0].finish_reason === "tool_calls";

  const toolCall = response.choices[0].message.tool_calls?.[0];

  if (!toolCall) {
    return;
  }

  if (shouldInvokeFunction) {
    const functionName = toolCall.function.name;

    if (functionName === "getDateAndTime") {
      const functionResponse = getDateAndTime();
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: functionResponse,
        tool_call_id: toolCall.id,
      });
    }
  }

  const finalResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  console.log("Final response :", finalResponse.choices[0].message.content);
};

// callOpenAIWithFunctionCalling();
