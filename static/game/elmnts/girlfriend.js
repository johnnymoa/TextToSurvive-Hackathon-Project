class Girlfriend extends Character {
  constructor(gameState, girlfriendImg) {
    super(gameState, girlfriendImg);
    this.gameState = gameState;
    this.gameState.girlfriend = this;
    this.img = girlfriendImg;
    this.setCharacterPosition(this.gameState.map_data.girlfriend_start_pos);
    this.currentHidingSpot = null;
    this.stressLevel = 30;
    this.inventory = [];
  }

  draw(CELL_SIZE) {
    if (this.characterPos) {
      push();
      if (this.previousPos && this.characterPos.x > this.previousPos.x) {
        scale(-1, 1);
        image(
          this.img,
          -this.characterPos.x * CELL_SIZE - CELL_SIZE * 2,
          this.characterPos.y * CELL_SIZE,
          CELL_SIZE * 2,
          CELL_SIZE * 2
        );
      } else {
        if (this.getIsHiding()) {
          tint(255, 153);
          image(
            this.img,
            this.characterPos.x * CELL_SIZE,
            this.characterPos.y * CELL_SIZE,
            CELL_SIZE * 2,
            CELL_SIZE * 2
          );
        } else {
          image(
            this.img,
            this.characterPos.x * CELL_SIZE,
            this.characterPos.y * CELL_SIZE,
            CELL_SIZE * 2,
            CELL_SIZE * 2
          );
        }
      }
      pop();
    }
  }

  updateStressLevel(stressChange) {
    // Add or subtract the stress change while keeping within 0-100 range
    this.stressLevel = Math.max(
      0,
      Math.min(100, this.stressLevel + stressChange)
    );
  }

  handleAction(response) {
    switch (response.action) {
      case "go":
        this.moveToRoom(response.target);
        break;
      case "hide":
        this.hide(response.target);
        break;  
      case "exit":
        this.exit();
        break;
    }
  }

  getAvailableHidingSpots() {
    // Find the current room in map data
    const currentRoom = this.gameState.map_data.rooms.find(
      (room) => room.name === this.getCurrentRoom()
    );
    // Return hiding places for current room if found, otherwise empty array
    return currentRoom ? currentRoom.hiding_places : [];
  }

  getAvailableFurniture() {
    // Get current room
    const currentRoom = this.getCurrentRoom();
    if (!currentRoom) return [];

    // Filter furniture list to only include items in current room that are in use
    return this.gameState.map_data.furniture.filter(
      furniture => furniture.room === currentRoom && furniture.in_use === true
    );
  }

  getIsHiding() {
    const hidingSpots = this.getAvailableHidingSpots();
    if (!this.characterPos || hidingSpots.length === 0) return false;

    return hidingSpots.some(
      (spot) =>
        spot.position.x === this.characterPos.x &&
        spot.position.y === this.characterPos.y
    );
  }

  hide(hidingSpotName) {
    const currentRoom = this.getCurrentRoom();
    if (!currentRoom) return;

    // Find the room data from map_data
    const roomData = this.gameState.map_data.rooms.find(
      (room) => room.name === currentRoom
    );
    if (!roomData) return;

    // Find the specific hiding spot in the room by checking if names contain each other
    const hidingSpot = roomData.hiding_places.find(
      (spot) =>
        spot.name
          .toLowerCase()
          .trim()
          .includes(hidingSpotName.toLowerCase().trim()) ||
        hidingSpotName
          .toLowerCase()
          .trim()
          .includes(spot.name.toLowerCase().trim())
    );

    if (!hidingSpot) return;

    // Move to the hiding spot position
    this.moveToPosition(hidingSpot.position, () => {
      this.currentHidingSpot = hidingSpotName;
    });
  }

  exit() {
    let the_exit = this.gameState.getTheExit();
    let x = the_exit.pos.x;
    let y = the_exit.pos.y-1;
    let pos = {"x": x, "y": y};
    this.moveToPosition(pos, () => {
      if (!this.inventory || !this.inventory.includes("Key")) {
        addProgramaticMessage(the_exit.locked_message);
      } else  {
        addProgramaticMessage(the_exit.unlocked_message);
      }
      });
  }
}
