class ClueManager {
    constructor(difficulty = 1) {
        this.difficulty = difficulty;
        this.codeLength = 2 + difficulty; // 3-5 digits based on difficulty
        this.solution = this.generateSolution();
        this.discoveredClues = new Set();
        this.clues = this.generateClues();
    }

    generateSolution() {
        let code = '';
        for (let i = 0; i < this.codeLength; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
    }

    generateClues() {
        // Split the solution into parts based on difficulty
        const clues = [];
        for (let i = 0; i < this.solution.length; i++) {
            const digit = this.solution[i];
            clues.push({
                id: `clue_${i}`,
                digit: digit,
                location: this.getClueLocation(i),
                hint: this.generateHint(digit, i)
            });
        }
        return clues;
    }

    getClueLocation(index) {
        // Map clue locations to specific rooms and objects
        const locations = [
            { room: "Storage", object: "closet" },
            { room: "Kitchen", object: "drawer" },
            { room: "My Bedroom", object: "bed" },
            { room: "Living Room", object: "couch" },
            { room: "Bathroom", object: "cabinet" }
        ];
        return locations[index];
    }

    generateHint(digit, position) {
        const hints = [
            `A torn piece of paper with the number ${digit}`,
            `A bloody handprint with ${digit} fingers`,
            `${digit} scratch marks on the wall`,
            `A child's drawing of ${digit} balloons`,
            `${digit} broken mirror pieces`
        ];
        return hints[position];
    }

    discoverClue(roomName, object) {
        const clue = this.clues.find(c => 
            c.location.room === roomName && 
            c.location.object === object
        );
        
        if (clue && !this.discoveredClues.has(clue.id)) {
            this.discoveredClues.add(clue.id);
            return clue;
        }
        return null;
    }

    isComplete() {
        return this.discoveredClues.size === this.codeLength;
    }
} 