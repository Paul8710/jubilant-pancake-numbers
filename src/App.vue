<template>
  <div class="container">
    <header>
      <h1>🔢 Number Facts</h1>
      <p class="subtitle">Discover fascinating facts about numbers!</p>
    </header>

    <!-- Number of the Day -->
    <div class="card number-of-day">
      <h2>Number of the Day</h2>
      <div class="number-display">{{ numberOfDay }}</div>
      <div class="fact-text">{{ dayFact }}</div>
    </div>

    <!-- Search Section -->
    <div class="card">
      <h2>Search Number Facts</h2>
      <div class="search-section">
        <div class="search-bar">
          <input 
            type="number" 
            v-model.number="searchInput" 
            @keypress.enter="searchNumber"
            placeholder="Enter a number..." 
          />
          <button @click="searchNumber">Search</button>
        </div>
        <div v-if="searchResults" v-html="searchResults"></div>
      </div>
    </div>

    <!-- I'm Feeling Lucky -->
    <div class="card">
      <button class="lucky-button" @click="feelingLucky">🎲 I'm Feeling Lucky!</button>
      <div v-if="luckyResults" v-html="luckyResults"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_BASE = 'https://math.tools/api/numbers'

// Reactive state
const numberOfDay = ref('-')
const dayFact = ref('Loading today\'s number...')
const searchInput = ref('')
const searchResults = ref('')
const luckyResults = ref('')

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
    searchResults.value = '<div class="result-item error">Please enter a valid number.</div>'
    return
  }

  searchResults.value = '<div class="loading">Searching for facts...</div>'

  try {
    const data = await fetchNumberData(number)
    displaySearchResults(data)
  } catch (error) {
    searchResults.value = '<div class="result-item error">Unable to fetch facts for this number. Please try again.</div>'
  }
}

// Display search results
function displaySearchResults(data) {
  if (!data || !data.contents) {
    searchResults.value = '<div class="result-item">No facts found for this number.</div>'
    return
  }

  let html = '<div class="results">'
  
  if (data.contents.trivia) {
    html += `
      <div class="result-item">
        <div class="result-title">Trivia</div>
        <div>${data.contents.trivia}</div>
      </div>
    `
  }
  
  if (data.contents.math) {
    html += `
      <div class="result-item">
        <div class="result-title">Math Fact</div>
        <div>${data.contents.math}</div>
      </div>
    `
  }
  
  if (data.contents.date) {
    html += `
      <div class="result-item">
        <div class="result-title">Date Fact</div>
        <div>${data.contents.date}</div>
      </div>
    `
  }

  if (data.contents.year) {
    html += `
      <div class="result-item">
        <div class="result-title">Year Fact</div>
        <div>${data.contents.year}</div>
      </div>
    `
  }

  html += '</div>'
  searchResults.value = html
}

// I'm Feeling Lucky - Random number with conversion
async function feelingLucky() {
  luckyResults.value = '<div class="loading">Finding a lucky number for you...</div>'

  try {
    // Generate random number between 1 and 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1
    
    const data = await fetchNumberData(randomNumber)
    
    let html = '<div class="results">'
    html += `<h3 style="text-align: center; color: #667eea; margin: 20px 0;">Your Lucky Number: ${randomNumber}</h3>`
    
    // Display facts
    if (data.contents) {
      if (data.contents.trivia) {
        html += `
          <div class="result-item">
            <div class="result-title">Trivia</div>
            <div>${data.contents.trivia}</div>
          </div>
        `
      }
      
      if (data.contents.math) {
        html += `
          <div class="result-item">
            <div class="result-title">Math Fact</div>
            <div>${data.contents.math}</div>
          </div>
        `
      }
    }

    // Add number conversions
    html += '<div class="result-item">'
    html += '<div class="result-title">Number System Conversions</div>'
    html += '<div class="conversion-grid">'
    
    const conversions = getNumberConversions(randomNumber)
    for (const [system, value] of Object.entries(conversions)) {
      html += `
        <div class="conversion-item">
          <div class="conversion-label">${system}</div>
          <div class="conversion-value">${value}</div>
        </div>
      `
    }
    
    html += '</div></div></div>'
    luckyResults.value = html
  } catch (error) {
    luckyResults.value = '<div class="result-item error">Unable to fetch lucky number. Please try again.</div>'
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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 800px;
  width: 100%;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.1em;
  opacity: 0.9;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.number-of-day {
  text-align: center;
}

.number-display {
  font-size: 4em;
  color: #667eea;
  font-weight: bold;
  margin: 20px 0;
}

.fact-text {
  font-size: 1.2em;
  line-height: 1.6;
  color: #555;
  margin-top: 15px;
}

.search-section {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

input[type="number"] {
  flex: 1;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1em;
  transition: border-color 0.3s;
}

input[type="number"]:focus {
  outline: none;
  border-color: #667eea;
}

button {
  padding: 15px 30px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

button:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

button:active {
  transform: translateY(0);
}

.lucky-button {
  width: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
  font-size: 1.1em;
}

.lucky-button:hover {
  background: linear-gradient(135deg, #d97fe8 0%, #e04659 100%);
}

.results {
  margin-top: 20px;
}

.result-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-left: 4px solid #667eea;
}

.result-title {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 5px;
}

.loading {
  text-align: center;
  color: #667eea;
  font-style: italic;
}

.error {
  background: #fee;
  border-left-color: #f44;
  color: #c33;
}

.conversion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.conversion-item {
  background: #f0f4ff;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

.conversion-label {
  font-size: 0.9em;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 5px;
}

.conversion-value {
  font-size: 1.1em;
  color: #333;
  word-break: break-all;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2em;
  }
  
  .number-display {
    font-size: 3em;
  }

  .search-bar {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
