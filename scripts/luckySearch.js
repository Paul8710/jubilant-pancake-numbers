// Lucky Search functionality
// Generates a random number and searches for it in Pi

const LuckySearch = {
    // Perform lucky search
    async performLuckySearch() {
        const luckyButton = document.getElementById('luckyButton')
        luckyButton.disabled = true

        // Generate random number between 2 and 128
        const randomNumber = Math.floor(Math.random() * (9007199254740) + 1)
        const randomBase = Math.floor(Math.random() * (32-2 +1) + 2)

        const luckyResult = document.getElementById('luckySearch')
        luckyResult.innerHTML = '<div class="loading">🎲 Génération d\'un nombre chanceux...</div>'

        try {
            // Fetch number data from API
            const numberData = await APIHandler.fetchConvertedNumber(randomNumber, randomBase)

            let resultHTML = '<div class="result-box">'
            resultHTML += `<div class="result-title">🍀 Ton nombre chanceux : ${numberData}</div>`

            resultHTML += `<div class="result-content" style="margin-top: 10px;">Il s'agit du nombre : <strong>${randomNumber}</strong> en base <strong>${randomBase}</strong></div>`

            resultHTML += '<hr style="margin: 15px 0 border: none border-top: 1px solid #ddd">'
            resultHTML += '</div>'

            luckyResult.innerHTML = resultHTML
        } catch (error) {
            console.error('Error in lucky search:', error)
            luckyResult.innerHTML = `
                <div class="result-box error">
                    <div class="result-title">❌ Erreur</div>
                    <div class="result-content">Impossible de récupérer les données. Réessaye plus tard.</div>
                </div>
            `
        }

        luckyResult.classList.remove('hidden')
        luckyButton.disabled = false

        setTimeout(() => {
            luckyResult.classList.add('hidden')
        }, 10000)
    }
}

// Global function for button onclick
async function feelingLucky() {
    await LuckySearch.performLuckySearch()
}
