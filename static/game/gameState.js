
        // Game state management
        class GameState {
          constructor() {
              // Initialize with rooms from apt.json
              this.rooms = [
                "Kichen",
                "Storage",
                "My Bedroom",
                "Bathroom",
                "Main Hallway",
                "Living Room",
                "Guest Bedroom",
                "Dining Room",
                "Office",
                "North Hallway"
              ];
      
              this.hideTargets = ["bed", "coat closet", "table", "shower"];
              this.searchTargets = ["dresser", "stove", "desk", "cabinet", "fridge", "bookcase"];
              this.items = ["lock pick", "flashlight", "knife", "remote"];
              this.useTargets = ["bedroom door", "main door", "TV"];
      
              // Track current game state
              this.currentRoom = this.rooms[0];
              this.inventory = [];
              this.isHiding = false;
          }
      
          handleAction(action, target) {
              switch (action) {
                  case 'go':
                      this.currentRoom = target;
                      break;
                  case 'hide':
                      this.isHiding = true;
                      break;
                  case 'search':
                      // Could add found items to inventory
                      break;
                  case 'use':
                      // Handle item usage
                      break;
              }
          }
      
          getPrompt() {
              return `You are the game master of "Get Me Out!", a single-player text-based survival game. The scenario: a player must guide their girlfriend to safety via text messages while she's being hunted by a murderous clown in their apartment. The player has access to security cameras and can give instructions through text.

Current state:
- Room: ${this.currentRoom}
- Hiding: ${this.isHiding}
- Inventory: ${this.inventory.join(", ") || "empty"}

RESPONSE FORMAT:
You must ALWAYS respond with a JSON object. The response should reflect the girlfriend's reaction to the player's message.

1. For movement instructions ("go" action):
{
  "action": "go",
  "to": "[room name]",
  "textMessage": "[girlfriend's response]"
}

2. For any other input or unclear instructions:
{
  "textMessage": "[girlfriend's response]"
}

VALID ROOMS:
Only these rooms are recognized for movement:
${this.rooms.join('\n')}

CHARACTER BEHAVIOR:
The girlfriend is aware of the danger and extremely distressed. Her text responses should be:
- Brief and urgent
- Reflect genuine fear and panic
- Written like real text messages (short, quick responses)
- No time for pleasantries or long explanations
- May include typos or rushed writing due to stress`;
          }

}
