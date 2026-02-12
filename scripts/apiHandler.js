// Manage all API calls

const APIHandler = {
    BASE_API: 'https://api.math.tools/numbers',
    NOD_ROUTE: '/nod',
    PI_ROUTE: '/pi',
    CONVERT_ROUTE: '/base',

    async fetchNumberOfDay() {
        try {
            const response = await fetch(`${this.BASE_API}${this.NOD_ROUTE}`, {method: "GET"})
            if (!response.ok) {
                throw new Error('Nod API request failed')
            }

            const data = await response.json()

            return data.contents.nod.numbers
        } catch (err) {
            console.error('Error fetching number of day:', err)
            throw err
        }
    },

    async fetchConvertedNumber(num, base) {
        return num.toString(base)
        /* try {
            const response = await fetch(`${this.BASE_API}${this.CONVERT_ROUTE}?number=${num}&to=${base}`, {method: "GET"})

            if (!response.ok) {
                throw new Error('Convertion API request failed')
            }

            const data = await response.json()

            return data.contents
        } catch (err) {
            console.error('Error fetching converted number:', err)
            
        } */
        
    }
}
