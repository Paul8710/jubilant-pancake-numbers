// Numberdle game logic

const Numberdle = {
    gameState: {
        targetNumber: null,
        targetData: null,
        attempts: [],
        gameOver: false,
        date: null
    },
    input: document.getElementById('guessInput'),

    async init() {
        const savedGame = StorageManager.loadGame()

        if(savedGame) {
            this.gameState = savedGame
            this.renderTable
            this.updateStatus
        } else {
            await this.createNewGame()
        }
    },

    async createNewGame() {
        try {
            const dailyNumber = APIHandler.fetchNumberOfDay()

            console.log(dailyNumber)
        } catch (err) {
            console.error('Error creating new game:', err)
            document.getElementById('dayFact').textContent = 'Erreur lors du chargement du jeu. Réessaye plus tard.'
        }
    },

    makeGuess() {
        if(this.gameState.gameOver) {
            this.updateStatus('🎉 Tu as déjà gagné ! Reviens demain pour un nouveau défi.', 'success')
            return
        }

        const guess = parseInt(this.input.value)

        const attemptData = this.analyzeGuess(guess)

        this.gameState.attempts.push(attemptData)

        this.input.value = ''

        if (guess === this.gameState.targetNumber) {
            this.gameState.gameOver = true
            this.updateStatus(`🎉 Bravo ! Tu as trouvé le nombre ${this.gameState.targetNumber} en ${this.gameState.attempts.length} essai(s) !`, 'success')
        }

        StorageManager.savedGame(this.gameState)
        this.renderTable
    },

    analyzeGuess(guessValue) {

    },

    renderTable() {

    }
}

function makeGuess() {
    Numberdle.makeGuess()
}