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
        const savedGame = LocalStorageManager.loadGame()

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
            const dailyNumber = await APIHandler.fetchNumberOfDay()

            this.gameState.targetNumber = dailyNumber.number

            this.gameState.targetData.even = dailyNumber.general-facts.even.value
            this.gameState.targetData.palindrome = dailyNumber.general-facts.palindrome.value
            this.gameState.targetData.digitSum = dailyNumber.recreational.digitssum.value
            this.gameState.targetData.digitAmount = dailyNumber.recreational.noofdigits.value
            this.gameState.targetData.prime = dailyNumber.prime-facts.prime.value

            LocalStorageManager.saveGame(this.gameState)

            document.getElementById('hiddenLoading').classList.remove('hidden')
            document.getElementById('dayFact').classList.add('hidden')

            this.updateStatus('🎯 Devine le nombre du jour !')
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

        LocalStorageManager.savedGame(this.gameState)
        this.renderTable
    },

    analyzeGuess(guessValue) {
        const target = this.gameState.targetNumber

        const targetDigitCount = this.gameState.targetData.digitAmount
        const targetDigitSum = this.gameState.targetData.digitSum
        const targetIsEven = this.gameState.targetData.even
        const targetIsPalindrome = this.gameState.targetData.palindrome
        const targetIsPrime = this.gameState.targetData.prime

        const guessDigitCount = numberInfoChecker.getDigitsAmount(guessValue)
        const guessDigitSum = numberInfoChecker.calculateDigitSum(guessValue)
        const guessIsEven = numberInfoChecker.isEven(guessValue)
        const guessIsPalindrome = numberInfoChecker.isPalindrome(guessValue)
        const guessIsPrime = numberInfoChecker.isPrime(guessValue)

        return {
            value: guessValue,

            valueColor: guessValue === target ? 'correct' : 'wrong',
            valueArrow: guessValue < target ? 'up' : (guessValue > target ? 'down' : null),
            
            // Digit count comparison
            digitCount: guessDigitCount,
            digitCountColor: this.getProximityColor(guessDigitCount, targetDigitCount),
            digitCountArrow: guessDigitCount < targetDigitCount ? 'up' : (guessDigitCount > targetDigitCount ? 'down' : null),
            
            // Digit sum comparison
            digitSum: guessDigitSum,
            digitSumColor: this.getProximityColor(guessDigitSum, targetDigitSum),
            digitSumArrow: guessDigitSum < targetDigitSum ? 'up' : (guessDigitSum > targetDigitSum ? 'down' : null),
            
            // Boolean comparisons
            isEven: guessIsEven,
            evenColor: guessIsEven === targetIsEven ? 'correct' : 'wrong',
            
            isPalindrome: guessIsPalindrome,
            palindromeColor: guessIsPalindrome === targetIsPalindrome ? 'correct' : 'wrong',
            
            isPrime: guessIsPrime,
            primeColor: guessIsPrime === targetIsPrime ? 'correct' : 'wrong'
        }
    },

    renderTable() {
        const tbody = document.getElementById('gameTableBody')
        tbody.innerHTML = ''

        this.gameState.attempts.forEach((attempt) => {
            const row = tbody.insertRow()

            // Value
            const cellValue = row.insertCell()
            cellValue.textContent = attempt.value
            cellValue.className = `cell-${attempt.valueColor}`
            if (attempt.valueArrow) {
                cellValue.classList.add(`arrow-${attempt.valueArrow}`)
            }

            // Digit count
            const cellDigitCount = row.insertCell()
            cellDigitCount.textContent = attempt.digitCount
            cellDigitCount.className = `cell-${attempt.digitCountColor}`
            if (attempt.digitCountArrow) {
                cellDigitCount.classList.add(`arrow-${attempt.digitCountArrow}`)
            }

            // Digit sum
            const cellDigitSum = row.insertCell()
            cellDigitSum.textContent = attempt.digitSum
            cellDigitSum.className = `cell-${attempt.digitSumColor}`
            if (attempt.digitSumArrow) {
                cellDigitSum.classList.add(`arrow-${attempt.digitSumArrow}`)
            }

            // Is Even
            const cellEven = row.insertCell()
            cellEven.textContent = attempt.isEven ? 'Oui' : 'Non'
            cellEven.className = `cell-${attempt.evenColor}`

            // Is Palindrome
            const cellPalindrome = row.insertCell()
            cellPalindrome.textContent = attempt.isPalindrome ? 'Oui' : 'Non'
            cellPalindrome.className = `cell-${attempt.palindromeColor}`

            // Is Prime
            const cellPrime = row.insertCell()
            cellPrime.textContent = attempt.isPrime ? 'Oui' : 'Non'
            cellPrime.className = `cell-${attempt.primeColor}`
        })
    },

    // Update status message
    updateStatus(message, type = 'info') {
        const statusDiv = document.getElementById('gameStatus')
        statusDiv.textContent = message
        statusDiv.className = `game-status status-${type}`
    }
}

function makeGuess() {
    Numberdle.makeGuess()
}