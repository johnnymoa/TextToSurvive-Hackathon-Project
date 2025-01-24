class Girlfriend {
    constructor(gameState) {
        this.gameState = gameState;
        this.chatMessages = [];
        this.characterPos = null;
        this.path = [];
        this.isMoving = false;
        this.moveInterval = null;
        this.mistralAPI = new MistralAPI();
        
        // Set up event listeners
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('prompt').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        });
    }

    getCharacterPosition() {
        return this.characterPos;
    }

    setCharacterPosition(pos) {
        this.characterPos = pos;
    }

    // Chat interface methods
    createLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message assistant-message';
        loadingDiv.innerHTML = `
            <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        return loadingDiv;
    }

    addMessageToChat(role, content) {
        const chatHistory = document.getElementById('chatHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}-message`;
        messageDiv.textContent = content;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Store message in chat history
        this.chatMessages.push({ role, content });
    }

    async sendMessage() {
        const prompt = document.getElementById('prompt').value.trim();
        if (!prompt) return;

        this.addMessageToChat('user', prompt);
        document.getElementById('prompt').value = '';

        const chatHistory = document.getElementById('chatHistory');
        const loadingIndicator = this.createLoadingIndicator();
        chatHistory.appendChild(loadingIndicator);

        try {
            // Get last 5 messages from chat history
            const recentMessages = this.chatMessages.slice(-5);
            
            // Prepare messages array for Mistral
            const messages = [
                { role: 'system', content: this.gameState.getPrompt() },
                ...recentMessages,
                { role: 'user', content: prompt }
            ];

            const assistantResponse = await this.mistralAPI.sendMessage(messages);
            console.log('Mistral response:', assistantResponse);

            try {
                const jsonStart = assistantResponse.indexOf('{');
                const jsonEnd = assistantResponse.lastIndexOf('}') + 1;
                const jsonContent = assistantResponse.substring(jsonStart, jsonEnd);
                const jsonResponse = JSON.parse(jsonContent);
                console.log('Parsed JSON response:', jsonResponse);

                if (jsonResponse.textMessage) {
                    this.addMessageToChat('assistant', jsonResponse.textMessage);
                }
                
                // Handle different actions
                if (jsonResponse.action === 'go' && jsonResponse.to) {
                    this.moveToRoom(jsonResponse.to);
                } else if (jsonResponse.action === 'hide' && jsonResponse.in) {
                    const success = this.gameState.hide(jsonResponse.in);
                    if (success) {
                        // Move to the hiding spot coordinates
                        const moveSuccess = this.moveToHidingSpot(jsonResponse.in);
                        if (!moveSuccess) {
                            // If we can't move to the hiding spot, undo the hiding state
                            this.gameState.unhide();
                            this.addMessageToChat('assistant', "I can't reach that hiding spot!");
                        }
                    } else {
                        this.addMessageToChat('assistant', "I can't hide there...");
                    }
                } else if (jsonResponse.action === 'unhide') {
                    this.gameState.unhide();
                }
            } catch (e) {
                console.error('Error parsing JSON from response:', e);
                this.addMessageToChat('assistant', 'Sorry, I had trouble understanding that response.');
            }
        } catch (error) {
            this.addMessageToChat('assistant', `Error: ${error.message}`);
        } finally {
            loadingIndicator.remove();
        }
    }

    // Movement methods
    moveToRoom(roomName) {
        const targetRoom = Array.from(rooms.entries())
            .find(([name]) => name.toLowerCase() === roomName.toLowerCase());
        if (!targetRoom || !this.characterPos) return false;

        const [_, cells] = targetRoom;
        if (cells.length === 0) return false;
        this.path = findPath(this.characterPos, cells[0]);
        if (this.path.length > 0) {
            this.isMoving = true;
            this.moveCharacterAlongPath();
            return true;
        }
        return false;
    }

    moveToHidingSpot(hidingSpotName) {
        if (!this.characterPos || !hidingPlaces) return false;

        // Find the hiding place coordinates from apt.json data
        const hidingSpotData = Array.from(hidingPlaces.entries())
            .find(([name]) => name.toLowerCase() === hidingSpotName.toLowerCase());
        
        if (!hidingSpotData || !hidingSpotData[1] || hidingSpotData[1].length === 0) return false;

        // Use the first cell of the hiding place as the target
        const targetCell = hidingSpotData[1][0];
        this.path = findPath(this.characterPos, targetCell);
        
        if (this.path.length > 0) {
            this.isMoving = true;
            this.moveCharacterAlongPath();
            return true;
        }
        return false;
    }

    move(newPath) {
        this.path = newPath;
        this.isMoving = true;
        this.moveCharacterAlongPath();
    }

    hide(newPath) {
        this.path = newPath;
        this.isMoving = true;
        this.moveCharacterAlongPath();
    }

    moveCharacterAlongPath() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        this.moveInterval = setInterval(() => {
            if (this.path.length === 0) {
                this.isMoving = false;
                clearInterval(this.moveInterval);
                // Update game state with new room when movement is complete
                const currentRoomEntry = Array.from(rooms.entries())
                    .find(([_, cells]) => cells.some(cell => 
                        cell.x === this.characterPos.x && cell.y === this.characterPos.y
                    ));
                if (currentRoomEntry) {
                    this.gameState.setCurrentRoom(currentRoomEntry[0]);
                }
                return;
            }
            const nextPos = this.path.shift();
            this.characterPos = nextPos;
        }, 200);
    }

    // Drawing methods
    drawCharacter(p5, CELL_SIZE) {
        if (this.characterPos) {
            p5.textSize(CELL_SIZE * 0.8);
            p5.textAlign(p5.CENTER, p5.CENTER);
            
            // Change character appearance when hiding
            if (this.gameState.isHiding) {
                p5.text('🤫', 
                    this.characterPos.x * CELL_SIZE + CELL_SIZE/2, 
                    this.characterPos.y * CELL_SIZE + CELL_SIZE/2
                );
            } else {
                p5.text('👧', 
                    this.characterPos.x * CELL_SIZE + CELL_SIZE/2, 
                    this.characterPos.y * CELL_SIZE + CELL_SIZE/2
                );
            }
        }
    }

    drawPath(p5, CELL_SIZE) {
        if (this.path.length > 0 && this.isMoving) {
            p5.noFill();
            p5.stroke(0, 255, 0);
            p5.strokeWeight(2);
            p5.line(
                this.characterPos.x * CELL_SIZE + CELL_SIZE/2,
                this.characterPos.y * CELL_SIZE + CELL_SIZE/2,
                this.path[0].x * CELL_SIZE + CELL_SIZE/2,
                this.path[0].y * CELL_SIZE + CELL_SIZE/2
            );
            for (let i = 0; i < this.path.length - 1; i++) {
                p5.line(
                    this.path[i].x * CELL_SIZE + CELL_SIZE/2,
                    this.path[i].y * CELL_SIZE + CELL_SIZE/2,
                    this.path[i + 1].x * CELL_SIZE + CELL_SIZE/2,
                    this.path[i + 1].y * CELL_SIZE + CELL_SIZE/2
                );
            }
            p5.strokeWeight(1);
        }
    }
}
