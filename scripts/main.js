// Main application initialization

window.addEventListener('DOMContentLoaded', async () => {
    console.log('Numberdle app initializing...')

    try {
        await Promise.all([
            Numberdle.init()
        ])

        console.log('Numberdle app initialized successfully!')
    } catch (err) {
        console.error('Error initializing app:', err)
    }

    setupEventListeners()

    scheduleMidnightReset()

    
    const backgroundNumbers = document.querySelector('.background-numbers')
    const numberOfColumns = 20; // Nombre de colonnes de chiffres

    for (let i = 0; i < numberOfColumns; i++) {
        const column = document.createElement('div')
        column.className = 'number-column'
        column.style.left = `${(i * (100 / numberOfColumns))}%`

        // Générer une colonne de chiffres aléatoires
        let numbers = ''
        for (let j = 0; j < 100; j++) {
            numbers += Math.floor(Math.random() * 10) + '\n'
        }
        column.textContent = numbers

        // Ajouter une animation avec un délai aléatoire
        column.style.animationDuration = `${5 + Math.random() * 10}s`
        column.style.animationDelay = `${Math.random() * 5}s`

        backgroundNumbers.appendChild(column)
    }
})

function setupEventListeners() {
    const guessInput = document.getElementById('guessInput')
    if(guessInput) {
        guessInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                makeGuess()
            }
        })
    }

    const searchInput = document.getElementById('searchInput')
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                searchNumber()
            }
        })
    }
}

function scheduleMidnightReset() {
    const timeUntilMidnight = LocalStorageManager.getTimeUntilMidnight()

    setTimeout(() => {
        console.log('Midnight reached - reloading for new game...')
        location.reload()
    }, timeUntilMidnight)

    const midnight = new Date(Date.now() + timeUntilMidnight)
    console.log(`Next game reset scheduled for: ${midnight.toLocaleString()}`)
}