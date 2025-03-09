class API {
    static BASE_URL = 'http://localhost:3000/api';
    static WS_URL = 'ws://localhost:8080';
    static ws = new WebSocket(API.WS_URL);

    // Authentication
    static async login(email, password) {
        try {
            const response = await fetch(`${this.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Teams
    static async createTeam(teamData) {
        try {
            const response = await fetch(`${this.BASE_URL}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(teamData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create team error:', error);
            throw error;
        }
    }

    static async joinTeam(teamId) {
        try {
            const response = await fetch(`${this.BASE_URL}/teams/${teamId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Join team error:', error);
            throw error;
        }
    }

    // Fundraising
    static async getFundraisingCampaigns() {
        try {
            const response = await fetch(`${this.BASE_URL}/fundraising`);
            return await response.json();
        } catch (error) {
            console.error('Get campaigns error:', error);
            throw error;
        }
    }

    static async contribute(campaignId, amount) {
        try {
            const response = await fetch(`${this.BASE_URL}/fundraising/${campaignId}/contribute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount })
            });
            return await response.json();
        } catch (error) {
            console.error('Contribution error:', error);
            throw error;
        }
    }

    // Messages
    static async getMessages() {
        try {
            const response = await fetch(`${this.BASE_URL}/messages`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Get messages error:', error);
            throw error;
        }
    }

    static async sendMessage(messageData) {
        try {
            const response = await fetch(`${this.BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(messageData)
            });
            return await response.json();
        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    }

    // WebSocket handlers
    static initializeWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'FUNDRAISING_UPDATE':
                    this.handleFundraisingUpdate(data);
                    break;
                case 'NEW_MESSAGE':
                    this.handleNewMessage(data);
                    break;
                case 'TEAM_UPDATE':
                    this.handleTeamUpdate(data);
                    break;
            }
        };
    }

    static handleFundraisingUpdate(data) {
        const progressBar = document.querySelector(`#campaign-${data.campaignId} .progress`);
        if (progressBar) {
            progressBar.style.width = `${data.progress}%`;
            progressBar.parentElement.querySelector('.progress-stats').textContent = 
                `KES ${data.current} raised of KES ${data.target} goal`;
        }
    }

    static handleNewMessage(data) {
        const messagesList = document.querySelector('.messages-list');
        if (messagesList) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.innerHTML = `
                <h4>${data.subject}</h4>
                <p>${data.sender}</p>
                <span>${new Date(data.timestamp).toLocaleString()}</span>
            `;
            messagesList.prepend(messageElement);
        }
    }

    static handleTeamUpdate(data) {
        const teamCard = document.querySelector(`#team-${data.teamId}`);
        if (teamCard) {
            teamCard.querySelector('.member-count').textContent = data.memberCount;
        }
    }
}

// Initialize WebSocket connection
API.initializeWebSocket(); 