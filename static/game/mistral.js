class MistralAPI {
    constructor() {
        this.apiKey = localStorage.getItem('mistralApiKey');
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('mistralApiKey', key);
    }

    getApiKey() {
        return this.apiKey;
    }

    async sendMessage(messages) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}