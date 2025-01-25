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

async function sendMessage() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return;

  addMessageToChat("user", prompt);
  document.getElementById("prompt").value = "";

  const chatHistory = document.getElementById("chatHistory");
  const loadingIndicator = createLoadingIndicator();
  chatHistory.appendChild(loadingIndicator);

  // First, get the stress prompt and send it
  const stressPrompt = gameState.getStressPrompt();
  const stressMessages = [
    {
      role: "system",
      content: stressPrompt,
    },
    { role: "user", content: prompt },
  ];
  console.log("stressMessages", stressMessages);

  // Get stress level change
  const stressResponse = await mistralAPI.sendMessage(stressMessages);
  const stressChange = JSON.parse(stressResponse).stressChange || 0;

  // Update girlfriend's stress level
  girlfriend.updateStressLevel(stressChange);
  console.log("girlfriend.stressLevel", girlfriend.stressLevel);

  console.log("stressChange", stressChange);

  // Now continue with the regular chat flow
  let masterPrompt = gameState.getPrompt();
  const recentMessages = chatMessages.slice(-5);

  const messages = [
    { role: "system", content: masterPrompt },
    ...recentMessages,
    { role: "user", content: prompt },
  ];

  const assistantResponse = await mistralAPI.sendMessage(messages);

  chatHistory.removeChild(loadingIndicator);

  const jsonStart = assistantResponse.indexOf("{");
  const jsonEnd = assistantResponse.lastIndexOf("}") + 1;
  const jsonContent = assistantResponse.substring(jsonStart, jsonEnd);
  const jsonResponse = JSON.parse(jsonContent);

  if (jsonResponse.action) {
    girlfriend.handleAction(jsonResponse);
  }

  if (jsonResponse.textMessage) {
    addMessageToChat("assistant", jsonResponse.textMessage);
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

  if (role === "assistant" && localStorage.getItem("isSoundOn") !== "false") {
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
