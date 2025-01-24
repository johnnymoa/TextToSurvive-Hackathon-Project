class MistralAPI {
  constructor() {
    // We don't need to store API key anymore since it's managed server-side
  }

  async sendMessage(messages) {
    const response = await fetch("/mistral-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
