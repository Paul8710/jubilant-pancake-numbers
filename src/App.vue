<template>
  <div class="max-w-3xl w-full">
    <header class="text-center text-white mb-8">
      <h1 class="text-4xl mb-2.5 drop-shadow-lg">🔢 Number Facts</h1>
      <p class="text-lg opacity-90">Discover fascinating facts about numbers!</p>
    </header>

    <!-- Number of the Day -->
    <div class="bg-white rounded-2xl p-8 mb-5 shadow-xl animate-fade-in text-center">
      <h2 class="text-2xl font-semibold mb-4">Number of the Day</h2>
      <div class="text-6xl text-primary font-bold my-5">{{ numberOfDay }}</div>
      <div class="text-xl leading-relaxed text-gray-600 mt-4">{{ dayFact }}</div>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-2xl p-8 mb-5 shadow-xl animate-fade-in">
      <h2 class="text-2xl font-semibold mb-4">Search Number Facts</h2>
      <div class="mb-5">
        <div class="flex gap-2.5 mb-4 max-md:flex-col">
          <input 
            type="number" 
            v-model.number="searchInput" 
            @keypress.enter="searchNumber"
            placeholder="Enter a number..." 
            class="flex-1 p-4 border-2 border-gray-300 rounded-xl text-base transition-colors focus:outline-none focus:border-primary"
          />
          <button 
            @click="searchNumber"
            class="px-8 py-4 bg-primary text-white rounded-xl text-base transition-all font-semibold hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-md:w-full"
          >
            Search
          </button>
        </div>
        <div v-if="searchState.loading" class="text-center text-primary italic">Searching for facts...</div>
        <div v-else-if="searchState.error" class="bg-red-50 p-4 rounded-xl mb-2.5 border-l-4 border-red-400 text-red-700">{{ searchState.error }}</div>
        <div v-else-if="searchState.facts.length > 0" class="mt-5">
          <div v-for="(fact, index) in searchState.facts" :key="index" class="bg-gray-50 p-4 rounded-xl mb-2.5 border-l-4 border-primary">
            <div class="font-semibold text-primary mb-1">{{ fact.title }}</div>
            <div>{{ fact.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- I'm Feeling Lucky -->
    <div class="bg-white rounded-2xl p-8 mb-5 shadow-xl animate-fade-in">
      <button 
        @click="feelingLucky"
        class="w-full py-5 text-lg font-semibold text-white rounded-xl transition-all border-none lucky-gradient hover:lucky-gradient-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        🎲 I'm Feeling Lucky!
      </button>
      <div v-if="luckyState.loading" class="text-center text-primary italic mt-5">Finding a lucky number for you...</div>
      <div v-else-if="luckyState.error" class="bg-red-50 p-4 rounded-xl mb-2.5 border-l-4 border-red-400 text-red-700 mt-5">{{ luckyState.error }}</div>
      <div v-else-if="luckyState.number" class="mt-5">
        <h3 class="text-center text-primary my-5 text-xl font-semibold">Your Lucky Number: {{ luckyState.number }}</h3>
        <div v-for="(fact, index) in luckyState.facts" :key="index" class="bg-gray-50 p-4 rounded-xl mb-2.5 border-l-4 border-primary">
          <div class="font-semibold text-primary mb-1">{{ fact.title }}</div>
          <div>{{ fact.text }}</div>
        </div>
        <div v-if="luckyState.conversions" class="bg-gray-50 p-4 rounded-xl mb-2.5 border-l-4 border-primary">
          <div class="font-semibold text-primary mb-1">Number System Conversions</div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-4">
            <div v-for="(value, system) in luckyState.conversions" :key="system" class="bg-indigo-50 p-2.5 rounded-lg text-center">
              <div class="text-sm text-primary font-semibold mb-1">{{ system }}</div>
              <div class="text-lg text-gray-800 break-all">{{ value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const API_BASE = 'https://math.tools/api/numbers'

// Reactive state
const numberOfDay = ref('-')
const dayFact = ref('Loading today\'s number...')
const searchInput = ref('')
const searchState = reactive({
  loading: false,
  error: '',
  facts: []
})
const luckyState = reactive({
  loading: false,
  error: '',
  number: null,
  facts: [],
  conversions: null
})

// Helper function to fetch data from API
async function fetchNumberData(number) {
  try {
    const response = await fetch(`${API_BASE}/${number}`)
    if (!response.ok) {
      throw new Error('API request failed')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching number data:', error)
    throw error
  }
}

// Get number of the day (using current date as seed)
async function loadNumberOfTheDay() {
  try {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
    const numOfDay = (dayOfYear % 365) + 1 // Number between 1-365

    numberOfDay.value = numOfDay
    
    const data = await fetchNumberData(numOfDay)
    displayNumberFact(data)
  } catch (error) {
    dayFact.value = 'Unable to load number of the day. Please try again later.'
  }
}

// Display number fact
function displayNumberFact(data) {
  if (data && data.contents) {
    const facts = []
    
    if (data.contents.trivia) {
      facts.push(data.contents.trivia)
    }
    if (data.contents.math) {
      facts.push(data.contents.math)
    }
    if (data.contents.date) {
      facts.push(data.contents.date)
    }
    
    if (facts.length > 0) {
      dayFact.value = facts[0]
    } else {
      dayFact.value = `${data.number || 'This number'} is a fascinating number!`
    }
  } else {
    dayFact.value = 'No facts available for this number.'
  }
}

// Search for a specific number
async function searchNumber() {
  const number = searchInput.value
  
  if (!number || isNaN(number)) {
    searchState.loading = false
    searchState.error = 'Please enter a valid number.'
    searchState.facts = []
    return
  }

  searchState.loading = true
  searchState.error = ''
  searchState.facts = []

  try {
    const data = await fetchNumberData(number)
    displaySearchResults(data)
  } catch (error) {
    searchState.loading = false
    searchState.error = 'Unable to fetch facts for this number. Please try again.'
  }
}

// Display search results
function displaySearchResults(data) {
  searchState.loading = false
  
  if (!data || !data.contents) {
    searchState.facts = []
    return
  }

  const facts = []
  
  if (data.contents.trivia) {
    facts.push({ title: 'Trivia', text: data.contents.trivia })
  }
  
  if (data.contents.math) {
    facts.push({ title: 'Math Fact', text: data.contents.math })
  }
  
  if (data.contents.date) {
    facts.push({ title: 'Date Fact', text: data.contents.date })
  }

  if (data.contents.year) {
    facts.push({ title: 'Year Fact', text: data.contents.year })
  }

  searchState.facts = facts
}

// I'm Feeling Lucky - Random number with conversion
async function feelingLucky() {
  luckyState.loading = true
  luckyState.error = ''
  luckyState.number = null
  luckyState.facts = []
  luckyState.conversions = null

  try {
    // Generate random number between 1 and 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1
    
    const data = await fetchNumberData(randomNumber)
    
    luckyState.loading = false
    luckyState.number = randomNumber
    
    // Display facts
    const facts = []
    if (data.contents) {
      if (data.contents.trivia) {
        facts.push({ title: 'Trivia', text: data.contents.trivia })
      }
      
      if (data.contents.math) {
        facts.push({ title: 'Math Fact', text: data.contents.math })
      }
    }
    
    luckyState.facts = facts
    luckyState.conversions = getNumberConversions(randomNumber)
  } catch (error) {
    luckyState.loading = false
    luckyState.error = 'Unable to fetch lucky number. Please try again.'
  }
}

// Convert number to various number systems
function getNumberConversions(num) {
  const conversions = {
    'Binary': num.toString(2),
    'Octal': num.toString(8),
    'Decimal': num.toString(10),
    'Hexadecimal': num.toString(16).toUpperCase()
  }

  // Add a random conversion system for fun
  const randomSystems = [
    { name: 'Base 3', base: 3 },
    { name: 'Base 5', base: 5 },
    { name: 'Base 7', base: 7 },
    { name: 'Base 12', base: 12 },
    { name: 'Base 20', base: 20 },
    { name: 'Base 36', base: 36 }
  ]
  
  const randomSystem = randomSystems[Math.floor(Math.random() * randomSystems.length)]
  conversions[randomSystem.name] = num.toString(randomSystem.base).toUpperCase()

  return conversions
}

// Load number of the day on component mount
onMounted(() => {
  loadNumberOfTheDay()
})
</script>

