function createLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-message assistant-message";
  loadingDiv.innerHTML = `
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            `;
  return loadingDiv;
}

async function addProgramaticMessage(message) {
  const chatHistory = document.getElementById("chatHistory");
  const loadingIndicator = createLoadingIndicator();
  chatHistory.appendChild(loadingIndicator);
  await new Promise(resolve => setTimeout(resolve, 2000));
  chatHistory.removeChild(loadingIndicator);
  addMessageToChat("assistant", message);
}

async function sendMessage() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return;

  addMessageToChat("user", prompt);
  document.getElementById("prompt").value = "";

  const chatHistory = document.getElementById("chatHistory");
  const loadingIndicator = createLoadingIndicator();
  chatHistory.appendChild(loadingIndicator);

  try {
    // Handle stress calculation first
    const stressPrompt = gameState.getStressPrompt();
    const stressMessages = [
      { role: "system", content: stressPrompt },
      { role: "user", content: prompt }
    ];
    
    const stressResponse = await mistralAPI.sendMessage(stressMessages);
    const stressChange = JSON.parse(stressResponse).stressChange || 0;
    girlfriend.updateStressLevel(stressChange);

    // Handle main girlfriend response
    const masterPrompt = gameState.getPrompt();
    const recentMessages = chatMessages.slice(-5);
    const messages = [
      { role: "system", content: masterPrompt },
      ...recentMessages,
      { role: "user", content: prompt }
    ];

    const assistantResponse = await mistralAPI.sendMessage(messages);
    const jsonResponse = JSON.parse(assistantResponse);

    chatHistory.removeChild(loadingIndicator);

    if (jsonResponse.action) {
      girlfriend.handleAction(jsonResponse);
    }

    if (jsonResponse.textMessage) {
      addMessageToChat("assistant", jsonResponse.textMessage);
    }

    // Handle rival response if active
    if (gameState.rivalActive) {
      await handleRivalResponse(prompt);
    }

  } catch (error) {
    console.error("Error in sendMessage:", error);
    chatHistory.removeChild(loadingIndicator);
    addMessageToChat("assistant", "Sorry, there was an error processing your message.");
  }
}

async function handleRivalResponse(prompt) {
  const loadingIndicator = createLoadingIndicator();
  const chatHistory = document.getElementById("chatHistory");
  
  // Add delay before rival starts typing
  await new Promise(resolve => setTimeout(resolve, 1500));
  chatHistory.appendChild(loadingIndicator);

  try {
    const rivalPrompt = `You are playing the role of a mysterious person who has joined the chat. Your responses should be:
- Somewhat cryptic but knowledgeable about the building
- Occasionally misleading but not obviously malicious
- Brief and text-message like
- Focused on survival but with unclear motives

Current game state:
${gameState.getRivalContext()}

Format your response as a JSON object:
{
  "textMessage": "your message here",
  "intent": "help" or "mislead"
}`;

    const messages = [
      { role: "system", content: rivalPrompt },
      { role: "user", content: prompt }
    ];

    const response = await mistralAPI.sendMessage(messages);
    const jsonResponse = JSON.parse(response);
    
    // Add delay before showing rival's message
    await new Promise(resolve => setTimeout(resolve, 1000));
    chatHistory.removeChild(loadingIndicator);
    
    addMessageToChat("rival", jsonResponse.textMessage);
  } catch (error) {
    console.error("Error in handleRivalResponse:", error);
    chatHistory.removeChild(loadingIndicator);
  }
}

function addMessageToChat(role, content) {
  const chatHistory = document.getElementById("chatHistory");
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${role}-message`;
  messageDiv.textContent = content;
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  chatMessages.push({ role, content });

  // Update message count and check rival activation
  gameState.messageCount++;
  gameState.checkRivalActivation();

  // Play sound for assistant or rival messages
  if ((role === "assistant" || role === "rival") && 
      localStorage.getItem("isSoundOn") !== "false") {
    playMessageSound();
  }
}

// Update Message function to use girlfriend instance
function Message() {
  if (girlfriend) {
    // Play message sound when sending a message
    if (localStorage.getItem("isSoundOn") !== "false") {
      playMessageSound();
    }
    sendMessage();
  }
}

// Allow sending message with Enter
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prompt").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      Message();
    }
  });

  try {
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.currentTime = 10;
    bgMusic.play().catch((error) => {
      console.log("Autoplay prevented:", error);
      isSoundOn = false;
      updateSoundIcon();
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
});
