class MistralAPI {
    constructor() {
     
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
          temperature: 0.5,
          top_p: 0.5,
          response_format: { type: "json_object" },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    }
  
    async analyzeStressLevel(message, currentStress) {
      try {
        const messages = [
          {
            role: "system",
            content: `You are a stress level analyzer. Given a message in the context of a survival horror game, evaluate how stressful or calming the message is.
                      The current stress level is ${currentStress}/100.
                      Return ONLY a number that represents the CHANGE in stress level, between -100 (very calming) and +100 (extremely stressful).
                      The final stress level must stay between 0 and 100.
                      Examples:
                      "Hide quickly!" -> 80 
                      "You're safe now, take a deep breath" -> -70
                      "The killer is right behind you!" -> 100
                      "Let's think about this calmly" -> -60`,
          },
          {
            role: "user",
            content: message,
          },
        ];
  
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
        const stressLevel = parseInt(data.choices[0].message.content);
        return isNaN(stressLevel) ? 0 : stressLevel;
      } catch (error) {
        console.error("Error analyzing stress level:", error);
        return 0;
      }
    }
  }
  