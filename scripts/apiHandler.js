// Manage all API calls

const APIHandler = {
    BASE_API: 'https://api.math.tools/numbers',
    NOD_ROUTE: '/nod',
    PI_ROUTE: '/pi',
    CONVERT_ROUTE: '/base',

    async fetchNumberOfDay() {
        try {
            const response = await fetch(`${this.BASE_API}${this.NOD_ROUTE}`)
            if (!response.ok) {
                throw new Error('Nod API request failed')
            }

            const data = await response.json()

            return data.contents
        } catch (err) {
            console.error('Error fetching number of day:', err)
            throw err
        }
    },

    async fetchPiDigits(numberOfDigits = 157) {
        try {
            const response = await fetch(`${this.BASE_API}${this.PI_ROUTE}`, {
                body: JSON.stringify({to: numberOfDigits})
            })

            if (!response.ok) {
                throw new Error('Pi API request failed')
            }

            const data = await response.json()
            const piString = data.contents.result

            StorageManager.savePiCache(piString)

            return piString
        } catch (err) {
            console.error('Error fetching Pi digits:', err)
            throw err
        }
    },

    async fetchConvertedNumber(numberToConvert, baseToConvert) {
        try {
            const response = await fetch(`${this.BASE_API}${this.CONVERT_ROUTE}`, {
                body: JSON.stringify({number: numberToConvert,to: baseToConvert})
            })

            if (!response.ok) {
                throw new Error('Convert API request failed')
            }

            const data = await response.json()
            const convertedContent = data.contents

            return convertedContent
        } catch (err) {
            console.error('Error fetching converted number:', err)
            throw err
        }
    }
}