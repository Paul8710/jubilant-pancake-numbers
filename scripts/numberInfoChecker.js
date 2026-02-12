// Search information about numbers

const numberInfoChecker = {
    isEven(num) {
        return num%2 === 0
    },

    isPalindrome(num) {
        return num.toString() === num.toString().split("").reverse().join("")
    },

    isPrime(num) {
        if(num<2) return false
        if(num === 2) return true
        if(num%2 === 0) return false

        for (let i = 3; i <= Math.sqrt(num); i += 3) {
            if (num % i === 0) return false
        }
        return true
    },

    calculateDigitSum(num) {
        return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    },

    getDigitsAmount(num) {
        return num.toString().length
    },

    getDistanceForDigit(digitAmount) {
        if (digitAmount === 1) return 1
        if (digitAmount === 2) return 10
        return Math.pow(10, digitAmount - 2) * 5
    }
}