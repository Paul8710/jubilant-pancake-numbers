// Website local storage management to avoid API saturation

const StorageManager = {
    NOD_KEY: 'nod',
    GAME_KEY: 'numberdle',
    PI_KEY: 'pi',

    // Get today's date string
    getTodayString() {
        const date = new Date()
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    // Get time until midnight
    getTimeUntilMidnight() {
        const now = new Date()
        const midnight = new Date(now)
        midnight.setHours(24, 0, 0, 0)
        return midnight - now
    },

    // Save game state
    saveGame(gameState) {
        try {
            localStorage.setItem(this.GAME_KEY, JSON.stringify(gameState))
        } catch (err) {
            console.error('Error saving game:', err)
        }
    },

    // Load game state
    loadGame() {
        try {
            const savedGame = localStorage.getItem(this.GAME_KEY)
            if (!savedGame) return null

            const gameState = JSON.parse(savedGame)

            if(gameState.date !== this.getTodayString()) {
                this.clearGame()
                return null
            }

            return gameState
        } catch (err) {
            console.error('Error loading game:', err)
            return null
        }
    },

    // Clear game state
    clearGame() {
        try {
            localStorage.removeItem(this.GAME_KEY);
        } catch (error) {
            console.error('Error clearing game:', error);
        }
    },

    // Save Pi digits
    savePiCache(digits) {
        try {
            const cacheData = {
                digits: digits
            }
            localStorage.setItem(this.PI_KEY, JSON.stringify(cacheData))
        } catch (error) {
            console.error('Error saving Pi cache:', error)
        }
    },

    // Load Pi digits
    loadPiCache() {
        try {
            const cached = localStorage.getItem(this.PI_KEY)
            if (!cached) return null

            const cacheData = JSON.parse(cached)

            return cacheData.digits
        } catch (error) {
            console.error('Error loading Pi cache:', error)
            return null
        }
    }
}