class Girlfriend extends Character {
    constructor(gameState, girlfriendImg) {
        super(gameState, girlfriendImg); 
        this.gameState = gameState;
        this.gameState.girlfriend = this;
        this.img = girlfriendImg;
        this.setCharacterPosition(this.gameState.map_data.girlfriend_start_pos);
        this.currentHidingSpot = null;
    }

    draw(CELL_SIZE) {
        if (this.characterPos) {
            const newSize = CELL_SIZE * 1.7;
            const offset = (newSize - CELL_SIZE) / 2;
            push();
            if (this.previousPos && this.characterPos.x > this.previousPos.x) {
                scale(-1, 1);
                image(this.img, 
                    -this.characterPos.x * CELL_SIZE - newSize + offset,
                    this.characterPos.y * CELL_SIZE - offset,
                    newSize,
                    newSize);
            } else {
                if (this.getIsHiding()) {
                    tint(255, 153);
                    image(this.img,
                        this.characterPos.x * CELL_SIZE - offset,
                        this.characterPos.y * CELL_SIZE - offset,
                        newSize,
                        newSize);
                } else {
                    image(this.img,
                        this.characterPos.x * CELL_SIZE - offset,
                        this.characterPos.y * CELL_SIZE - offset,
                        newSize,
                        newSize);
                }
            }
            pop();
        }
    }

    handleAction(response) {
        switch (response.action) {
            case 'go':
                this.moveToRoom(response.target);
                break;
            case 'hide':
                this.hide(response.target);
                break;
        }
    }
    
    getAvailableHidingSpots() {
        // Find the current room in map data
        const currentRoom = this.gameState.map_data.rooms.find(room => 
            room.name === this.getCurrentRoom()
        );
        // Return hiding places for current room if found, otherwise empty array
        return currentRoom ? currentRoom.hiding_places : [];
    }

    getIsHiding() {
        const hidingSpots = this.getAvailableHidingSpots();
        if (!this.characterPos || hidingSpots.length === 0) return false;
        
        return hidingSpots.some(spot => 
            spot.position.x === this.characterPos.x && 
            spot.position.y === this.characterPos.y
        );
    }

    hide(hidingSpotName) {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        // Find the room data from map_data
        const roomData = this.gameState.map_data.rooms.find(room => room.name === currentRoom);
        if (!roomData) return;

        // Find the specific hiding spot in the room by checking if names contain each other
        const hidingSpot = roomData.hiding_places.find(spot => 
            spot.name.toLowerCase().trim().includes(hidingSpotName.toLowerCase().trim()) ||
            hidingSpotName.toLowerCase().trim().includes(spot.name.toLowerCase().trim())
        );
        console.log(hidingSpot);
        if (!hidingSpot) return;

        // Move to the hiding spot position
        this.moveToPosition(hidingSpot.position,()=>{
            this.currentHidingSpot = hidingSpotName;
        } );
    }
}
