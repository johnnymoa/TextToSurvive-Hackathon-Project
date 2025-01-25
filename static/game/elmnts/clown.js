class Clown extends Character {
    constructor(gameState, clownImg) {
        super(gameState, clownImg);
        this.isChasing = false;
        this.targetGirlfriend = null;
        this.gameState.clown = this;
        this.startAutonomousBehavior();
        this.setCharacterPosition(this.gameState.map_data.clown_start_pos);
    }

    startAutonomousBehavior() {
        if (this.behaviorInterval) {
            clearInterval(this.behaviorInterval);
        }

        this.behaviorInterval = setInterval(() => {
            this.decideBehavior();
        }, 3000);
    }

    decideBehavior() {
        if (!this.isMoving) {
            const roomEntries = this.gameState.map_data.rooms;
            
            if (this.targetGirlfriend && !this.gameState.girlfriend.isHiding) {
                const girlfriendPos = this.targetGirlfriend.getCharacterPosition();
                if (girlfriendPos) {
                    this.path = this.findPath(this.characterPos, girlfriendPos);
                    if (this.path.length > 0) {
                        this.isChasing = true;
                        this.moveCharacterAlongPath();
                        return;
                    }
                }
            }

            this.isChasing = false;
            this.targetGirlfriend = null;
            
            const randomRoom = roomEntries[Math.floor(Math.random() * roomEntries.length)];
            if (randomRoom) {
                this.path = this.findPath(this.characterPos, randomRoom.label_position);
                if (this.path.length > 0) {
                    this.moveCharacterAlongPath();
                }
            }
        }
    }

    checkForGirlfriend(girlfriend) {
        if (!this.gameState.girlfriend || !this.characterPos || this.gameState.girlfriend.isHiding) {
            this.targetGirlfriend = null;
            return;
        }

        const girlfriendPos = this.gameState.girlfriend.getCharacterPosition();
        if (!girlfriendPos) return;

        // First check if in same room
        const clownRoom = this.getCurrentRoom();
        const girlfriendRoom = this.gameState.girlfriend.getCurrentRoom();
        
        if (clownRoom && girlfriendRoom && clownRoom === girlfriendRoom) {
            // Check if within 3 cells in any direction
            const xDistance = Math.abs(this.characterPos.x - girlfriendPos.x);
            const yDistance = Math.abs(this.characterPos.y - girlfriendPos.y);
            
            if (xDistance <= 3 && yDistance <= 3) {
                this.targetGirlfriend = girlfriend;
                // Immediately update path to chase
                if (!this.isChasing) {
                    this.path = this.findPath(this.characterPos, girlfriendPos);
                    if (this.path.length > 0) {
                        this.isChasing = true;
                        this.moveCharacterAlongPath();
                    }
                }
            }
        } else {
            // Not in same room, stop chasing
            this.isChasing = false;
            this.targetGirlfriend = null;
        }
    }
  
    draw(CELL_SIZE) {
        if (this.characterPos) {
            const newSize = CELL_SIZE * 1.5; 
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
                image(this.img,
                    this.characterPos.x * CELL_SIZE - offset,
                    this.characterPos.y * CELL_SIZE - offset,
                    newSize,
                    newSize);
            }
            pop();
        }
    }

  
}
