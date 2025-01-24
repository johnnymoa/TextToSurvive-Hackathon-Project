        // Game state management
        class GameState {
          constructor() {
              // Initialize with rooms from apt.json
              this.rooms = [
                "My Bedroom",
                "Kitchen",
                "Storage",
                "Bathroom",
                "Main Hallway",
                "Living Room",
                "Guest Bedroom",
                "Dining Room",
                "Office",
                "North Hallway"
              ];
      
              this.hideTargets = [
                {
                    "room": "My Bedroom", 
                    "hiding_place": "bed",
                    "hiding_type": "under"
                },
                {
                    "room": "North Hallway", 
                    "hiding_place": "coat closet",
                    "hiding_type": "in"
                },
                {
                    "room": "Dining Room", 
                    "hiding_place": "table",
                    "hiding_type": "under"
                },
                {
                    "room": "Guest Bedroom", 
                    "hiding_place": "bed",
                    "hiding_type": "under"
                }
              ];

              this.searchTargets = ["dresser", "desk", "bookcase", "cabinet", "dead body", "fridge", "stove", "coffee table"];

              this.items = ["lock pick", "book note", "flashlight", "knife", "oil", "remote"];

              this.useTargets = ["bedroom door", "bookcase", "storage door", "dead body","coffee table","TV"];
      
              // Track current game state
              this.currentRoom = this.rooms[0];
              this.inventory = [];
              this.isHiding = false;
              this.currentHidingSpot = null;
          }
          setCurrentRoom(room) {
            // Clear any previous hiding spot when moving rooms
            this.isHiding = false;
            this.currentHidingSpot = null;
            this.currentRoom = room;
          }

          getAvailableHidingSpots() {
            return this.hideTargets.filter(target => 
                target.room.toLowerCase() === this.currentRoom.toLowerCase()
            );
          }

          hide(hidingPlace) {
            const spot = this.hideTargets.find(target => 
                target.room.toLowerCase() === this.currentRoom.toLowerCase() &&
                target.hiding_place.toLowerCase() === hidingPlace.toLowerCase()
            );

            if (spot) {
                this.isHiding = true;
                this.currentHidingSpot = spot;
                return true;
            }
            return false;
          }

          unhide() {
            this.isHiding = false;
            this.currentHidingSpot = null;
          }

          handleAction(action, target) {
              switch (action) {
                  case 'go':
                      this.currentRoom = target;
                      break;
                  case 'hide':
                      return this.hide(target);
                  case 'unhide':
                      this.unhide();
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
- The girlfriend is currently in Room: ${this.currentRoom}
${this.isHiding ? `- Hiding: The girlfriend is currently hiding ${this.currentHidingSpot.hiding_type} the ${this.currentHidingSpot.hiding_place}` : ''}
${this.inventory.length > 0 ? `- Inventory: ${this.inventory.join(", ")}` : ''}

RESPONSE FORMAT:
You must ALWAYS respond with a JSON object. The response should reflect the girlfriend's reaction to the player's message.

1. For movement instructions ("go" action):
{
  "action": "go",
  "to": "[room name]",
  "textMessage": "[girlfriend's response]"
}

2. For hiding instructions ("hide" action):
{
  "action": "hide",
  "in": "[hiding place name]",
  "textMessage": "[girlfriend's response]"
}

3. For any other input or unclear instructions:
{
  "textMessage": "[girlfriend's response]"
}

VALID ROOMS:
Only these rooms are recognized for movement:
${this.rooms.join('\n')}

VALID HIDING PLACES IN CURRENT ROOM:
${this.getAvailableHidingSpots().map(spot => `- ${spot.hiding_place} (${spot.hiding_type})`).join('\n')}

CHARACTER BEHAVIOR:
The girlfriend is aware of the danger and extremely distressed. Her text responses should be:
- Brief and urgent
- Reflect genuine fear and panic
- Written like real text messages (short, quick responses)
- No time for pleasantries or long explanations
- May include typos or rushed writing due to stress`;
          }

}
