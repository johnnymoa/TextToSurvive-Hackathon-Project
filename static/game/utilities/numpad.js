
class Numpad {
        constructor(containerId, options = {}) {
            // Get difficulty from environment or default to 1
            const difficulty = parseInt(process.env.GAME_DIFFICULTY) || 1;
            
            // Calculate code length based on difficulty (1=3 digits, 2=4 digits, 3=5 digits)
            const codeLength = 2 + difficulty;
            
            this.container = document.getElementById(containerId);
            this.options = {
                // Generate random code of appropriate length
                code: options.code || this.generateCode(codeLength),
                onSuccess: options.onSuccess || (() => alert('Correct code!')),
                onError: options.onError || (() => alert('Wrong code!'))
            };
            
            this.currentCode = '';
            this.maxLength = codeLength;
            this.init();
        }
    
        generateCode(length) {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += Math.floor(Math.random() * 10).toString();
            }
            return code;
        }
    
        handleInput(number) {
            if (this.currentCode.length < this.maxLength) {
                this.currentCode += number;
                this.updateDisplay();
                
                if (this.currentCode.length === this.maxLength) {
                    this.checkCode();
                }
            }
        }
    
        updateDisplay() {
            this.display.textContent = this.currentCode.padEnd(this.maxLength, 'X');
        }

    init() {
        // Create display
        this.display = document.createElement('div');
        this.display.className = 'numpad-display';
        this.container.appendChild(this.display);
        
        // Create numpad container
        this.numpadGrid = document.createElement('div');
        this.numpadGrid.className = 'numpad-grid';
        this.container.appendChild(this.numpadGrid);
        
        // Create number buttons
        for (let i = 1; i <= 9; i++) {
            this.createButton(i);
        }
        this.createButton(0);
        
        this.updateDisplay();
    }

    createButton(number) {
        const button = document.createElement('button');
        button.className = 'numpad-key';
        button.textContent = number;
        button.addEventListener('click', () => this.handleInput(number));
        this.numpadGrid.appendChild(button);
    }

    handleInput(number) {
        if (this.currentCode.length < 3) {
            this.currentCode += number;
            this.updateDisplay();
            
            if (this.currentCode.length === 3) {
                this.checkCode();
            }
        }
    }

    updateDisplay() {
        this.display.textContent = this.currentCode.padEnd(3, 'X');
    }

    checkCode() {
        if (this.currentCode === this.options.code) {
            this.options.onSuccess();
        } else {
            this.options.onError();
        }
        this.currentCode = '';
        this.updateDisplay();
    }

    reset() {
        this.currentCode = '';
        this.updateDisplay();
    }
}

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Create required HTML elements if they don't exist
    if (!document.getElementById('numpad-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'numpad-overlay';
        overlay.className = 'numpad-overlay hidden';
        
        const container = document.createElement('div');
        container.id = 'numpad-container';
        overlay.appendChild(container);
        
        document.body.appendChild(overlay);
    }
    
    if (!document.getElementById('toggle-numpad')) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-numpad';
        toggleButton.className = 'toggle-numpad';
        toggleButton.textContent = 'Enter Code';
        document.body.appendChild(toggleButton);
    }

    // Initialize the numpad with desired options
    const numpad = new Numpad('numpad-container', {
        code: '123',
        onSuccess: () => {
            console.log('Success! Correct code entered');
            // Add your game logic here
        },
        onError: () => {
            console.log('Error! Wrong code');
        }
    });

    // Setup toggle functionality
    const toggleButton = document.getElementById('toggle-numpad');
    const numpadOverlay = document.getElementById('numpad-overlay');

    toggleButton.addEventListener('click', () => {
        numpadOverlay.classList.toggle('hidden');
    });

    // Close numpad when clicking outside
    document.addEventListener('click', (event) => {
        if (!numpadOverlay.contains(event.target) && 
            !toggleButton.contains(event.target) && 
            !numpadOverlay.classList.contains('hidden')) {
            numpadOverlay.classList.add('hidden');
        }
    });
});