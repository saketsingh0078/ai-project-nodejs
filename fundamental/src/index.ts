import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENI_API_KEY,
});

const main = async () => {
  const prompt = "suggest popular programming languages";
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "reply with greeting in the beginnering language",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    n: 2,
    frequency_penalty: 0.5,
  });
  console.log(response.choices[0].message.content);
  console.log(response.choices[1].message.content);
};

main();
