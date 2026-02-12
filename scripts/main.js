// Main application initialization

window.addEventListener('load', async () => {
    console.log('Numberdle app initializing...')

    try {
        await Promise.all([
            Numberdle.init(),
            //NumberSearch.init()
        ])

        console.log('Numberdle app initialized successfully!')
    } catch (err) {
        console.error('Error initializing app:', err)
    }

    setupEventListeners()

    //scheduleMidnightReset()
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
    const timeUntilMidnight = StorageManager.getTimeUntilMidnight()

    setTimeout(() => {
        console.log('Midnight reached - reloading for new game...')
        location.reload()
    }, timeUntilMidnight)

    const midnight = new Date(Date.now() + timeUntilMidnight)
    console.log(`Next game reset scheduled for: ${midnight.toLocaleString()}`)
}