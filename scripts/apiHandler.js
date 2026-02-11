// Manage API calls

export const APIHandler = {
    NUMBERS_API: 'https://math.tools/api/numbers',
    NUM_OF_DAY: '/nod',
    PI_DIGIT: '',
    INFO_ON_NUM: '',

    async fetchNumberOfDay() {
        try {
            const response = await fetch(`${this.NUMBERS_API}${this.NUM_OF_DAY}`)
            if(!response.ok) {
                throw new Error('API request failed')
            }
            return await response.json()
        } catch (err) {
            console.log('Error fetching nod: ', err)
        }
    },

    async fetchPiDigits() {
        
    },

    async fetchInfoOn(number) {

    }
}

