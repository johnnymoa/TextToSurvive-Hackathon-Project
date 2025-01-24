class Clown {
    constructor(gameState, clownImg) {
        this.gameState = gameState;
        this.characterPos = null;
        this.previousPos = null;
        this.path = [];
        this.isMoving = false;
        this.moveInterval = null;
        this.behaviorInterval = null;
        this.img = clownImg;
        this.isChasing = false;
        this.targetGirlfriend = null;
        
        // Start autonomous behavior
        this.startAutonomousBehavior();
    }

    getCharacterPosition() {
        return this.characterPos;
    }

    setCharacterPosition(pos) {
        this.characterPos = pos;
    }

    startAutonomousBehavior() {
        // Clear any existing interval
        if (this.behaviorInterval) {
            clearInterval(this.behaviorInterval);
        }

        // Every 3 seconds, decide what to do
        this.behaviorInterval = setInterval(() => {
            this.decideBehavior();
        }, 3000);
    }

    decideBehavior() {
        // If we're not currently moving
        if (!this.isMoving) {
            // Get all rooms
            const roomEntries = Array.from(rooms.entries());
            
            // If we have a girlfriend target and she's not hiding, chase her
            if (this.targetGirlfriend && !this.targetGirlfriend.gameState.isHiding) {
                const girlfriendPos = this.targetGirlfriend.getCharacterPosition();
                if (girlfriendPos) {
                    this.path = findPath(this.characterPos, girlfriendPos);
                    if (this.path.length > 0) {
                        this.isChasing = true;
                        this.moveCharacterAlongPath();
                        return;
                    }
                }
            }

            // If we're not chasing or can't chase, move to random room
            this.isChasing = false;
            this.targetGirlfriend = null;
            
            // Select random room
            const randomRoom = roomEntries[Math.floor(Math.random() * roomEntries.length)];
            if (randomRoom && randomRoom[1].length > 0) {
                const [_, cells] = randomRoom;
                this.path = findPath(this.characterPos, cells[0]);
                if (this.path.length > 0) {
                    this.moveCharacterAlongPath();
                }
            }
        }
    }

    checkForGirlfriend(girlfriend) {
        if (!girlfriend || !this.characterPos || girlfriend.gameState.isHiding) {
            this.targetGirlfriend = null;
            return;
        }

        const girlfriendPos = girlfriend.getCharacterPosition();
        if (!girlfriendPos) return;

        // Check if within 3 cells in any direction
        const xDistance = Math.abs(this.characterPos.x - girlfriendPos.x);
        const yDistance = Math.abs(this.characterPos.y - girlfriendPos.y);
        
        if (xDistance <= 3 && yDistance <= 3) {
            this.targetGirlfriend = girlfriend;
            // Immediately update path to chase
            if (!this.isChasing) {
                this.path = findPath(this.characterPos, girlfriendPos);
                if (this.path.length > 0) {
                    this.isChasing = true;
                    this.moveCharacterAlongPath();
                }
            }
        }
    }

    moveCharacterAlongPath() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        this.isMoving = true;
        this.moveInterval = setInterval(() => {
            if (this.path.length === 0) {
                this.isMoving = false;
                clearInterval(this.moveInterval);
                
                // Update current room
                const currentRoomEntry = Array.from(rooms.entries())
                    .find(([_, cells]) => cells.some(cell => 
                        cell.x === this.characterPos.x && cell.y === this.characterPos.y
                    ));
                
                if (currentRoomEntry) {
                    // If chasing and in same room, immediately update path to girlfriend
                    if (this.isChasing && this.targetGirlfriend && !this.targetGirlfriend.gameState.isHiding) {
                        const girlfriendPos = this.targetGirlfriend.getCharacterPosition();
                        if (girlfriendPos) {
                            this.path = findPath(this.characterPos, girlfriendPos);
                            if (this.path.length > 0) {
                                this.moveCharacterAlongPath();
                            }
                        }
                    }
                }
                return;
            }
            this.previousPos = { ...this.characterPos };
            const nextPos = this.path.shift();
            this.characterPos = nextPos;
        }, 200);
    }

    draw(p5, CELL_SIZE) {
        if (this.characterPos) {
            p5.textSize(CELL_SIZE * 0.8);
            p5.textAlign(p5.CENTER, p5.CENTER);
            
            const newSize = CELL_SIZE * 1.5; // 50% bigger
            const offset = (newSize - CELL_SIZE) / 2; // Offset to maintain center position
            
            p5.push();
            if (this.previousPos && this.characterPos.x > this.previousPos.x) {
                p5.scale(-1, 1);
                p5.image(this.img, 
                    -this.characterPos.x * CELL_SIZE - newSize + offset, 
                    this.characterPos.y * CELL_SIZE - offset,
                    newSize, 
                    newSize);
            } else {
                p5.image(this.img,
                    this.characterPos.x * CELL_SIZE - offset,
                    this.characterPos.y * CELL_SIZE - offset,
                    newSize,
                    newSize);
            }
            p5.pop();
        }
    }

    drawPath(p5, CELL_SIZE) {
        if (this.path.length > 0 && this.isMoving) {
            p5.noFill();
            p5.stroke(255, 0, 0); // Red path for clown
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
