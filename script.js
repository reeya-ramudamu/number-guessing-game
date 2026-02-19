// ==================== GLOBAL VARIABLES ====================
// These variables maintain the game state throughout execution.
let secretNumber // Random number the player must guess
let attempts // Number of attempts made in current game
let guessHistory // Array to store previous guesses
let bestScore // Lowest attempts taken to win (stored in session)
let gamesPlayed // Total games completed (stored in session)

// ==================== INITIALIZATION ====================
// Runs when the DOM is fully loaded.
$(document).ready(function () {
  loadGameData() // Load stored stats from session storage
  initializeGame() // Start a new game
  setupEventListeners() // Attach button and keyboard events
})

// ==================== GAME FUNCTIONS ====================

// Initializes or resets the game state
function initializeGame () {
  // Generate random number between 1 and 100
  secretNumber = Math.floor(Math.random() * 100) + 1

  // Store secret number in session (optional, mainly for debugging/demo)
  sessionStorage.setItem('secretNumber', secretNumber)

  attempts = 0
  guessHistory = []

  updateDisplay()

  // Reset input field and enable controls
  $('#guessInput').val('').focus()
  $('#guessInput').prop('disabled', false)
  $('#submitGuess').prop('disabled', false)

  showMessage('Make your first guess!', 'info')
}

// Validates and processes the player's guess
function checkGuess () {
  const guess = parseInt($('#guessInput').val())

  // Validate input: must be a number
  if (isNaN(guess)) {
    showMessage('Please enter a valid Number!', 'error')
    return
  }

  // Validate range: must be between 1 and 100
  if (guess < 1 || guess > 100) {
    showMessage('Number must be between 1 and 100!', 'warning')
    return
  }

  // Prevent duplicate guesses
  if (guessHistory.includes(guess)) {
    showMessage('You already guessed ' + guess + '!', 'warning')
    return
  }

  // Update game state
  attempts++
  guessHistory.push(guess)

  // Compare guess with secret number
  if (guess === secretNumber) {
    handleWin()
  } else if (guess < secretNumber) {
    showMessage('📉 Too low! Try higher.', 'warning')
  } else {
    showMessage('📈 Too high! Try lower.', 'warning')
  }

  updateDisplay()

  // Clear input field for next guess
  $('#guessInput').val('').focus()
}

// Handles win condition logic
function handleWin () {
  showMessage('🎉 You won in ' + attempts + ' attempts!', 'success')

  gamesPlayed++

  // Update best score if it's the first game OR better score achieved
  if (bestScore === null || attempts < bestScore) {
    bestScore = attempts
  }

  saveGameData() // Persist updated statistics
  updateDisplay()

  // Disable input after winning
  $('#guessInput').prop('disabled', true)
  $('#submitGuess').prop('disabled', true)
}

// ==================== SESSION STORAGE ====================

// Save statistics in session storage
function saveGameData () {
  sessionStorage.setItem('bestScore', bestScore)
  sessionStorage.setItem('gamesPlayed', gamesPlayed)
}

// Load statistics from session storage
function loadGameData () {
  bestScore = sessionStorage.getItem('bestScore')
  gamesPlayed = sessionStorage.getItem('gamesPlayed')

  // Convert stored string values back to numbers
  bestScore = bestScore ? parseInt(bestScore) : null
  gamesPlayed = gamesPlayed ? parseInt(gamesPlayed) : 0
}

// Clears all stored statistics
function clearStatistics () {
  if (confirm('Clear all statistics?')) {
    sessionStorage.clear()

    // Reset variables
    bestScore = null
    gamesPlayed = 0
    guessHistory = []
    attempts = 0

    updateDisplay()
    showMessage('Statistics cleared!', 'info')
  }
}

// ==================== DISPLAY FUNCTIONS ====================

// Updates statistics and history on the UI
function updateDisplay () {
  $('#attempts').text(attempts)
  $('#bestScore').text(bestScore !== null ? bestScore : '-')
  $('#gamesPlayed').text(gamesPlayed)

  displayGuessHistory()
}

// Displays guess history dynamically
function displayGuessHistory () {
  if (guessHistory.length === 0) {
    $('#historyList').text('None yet')
    return
  }

  let historyHTML = ''

  // Loop through guesses and create styled badges
  for (let i = 0; i < guessHistory.length; i++) {
    historyHTML += '<span class="guess-item">' + guessHistory[i] + '</span>'
  }

  $('#historyList').html(historyHTML)
}

// Displays feedback messages with dynamic styling
function showMessage (text, type) {
  const $message = $('#message')

  // Remove previous status classes
  $message.removeClass('success error info warning')

  // Add new status class and update text
  $message.addClass(type).text(text)
}

// ==================== EVENT HANDLERS ====================

// Attach all user interaction events
function setupEventListeners () {
  // Button click to submit guess
  $('#submitGuess').click(function () {
    checkGuess()
  })

  // Press Enter key to submit guess
  $('#guessInput').keypress(function (event) {
    if (event.which === 13) {
      checkGuess()
    }
  })

  // Start new game
  $('#resetGame').click(function () {
    initializeGame()
  })

  // Clear statistics
  $('#clearStats').click(function () {
    clearStatistics()
  })
}
