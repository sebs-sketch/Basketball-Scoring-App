// Cool things to add:
// 		Stop timer and cancel button events during different periods.
//		Teams change sides after halftime.
//		Add button animations on start for user learning.
//		Make timer comply with all game rules such as:
//				Duration 4 periods of 12 minutes = 48 minutes.
//				Halftime = 15 minutes, 2 minute breaks between periods.
//				7 timeouts per game 75 seconds each, 4 timeouts mandatory (full timeout per quarter).
//				Maximum 3 timeouts in the last quarter.
//				Overtime is 5 minutes, 1 per team, at least for this app.


// Features:
//		Nice retro-modern design
//		Colorful backlight for scoring
//		Leader is highlighted
//		1 click for adding, 2 clicks for subtracting
//		Press button animation
//		"New Game" button
//		Fouls, period, score and timer counters
//		


// DOM access
const timer = document.querySelector("#timer")
const homeScore = document.querySelector("#home-score")
const plusOneHome = document.querySelector("#plus-one-home")
const plusTwoHome = document.querySelector("#plus-two-home")
const plusThreeHome = document.querySelector("#plus-three-home")
const guestsScore = document.querySelector("#guests-score")
const plusOneGuests = document.querySelector("#plus-one-guests")
const plusTwoGuests = document.querySelector("#plus-two-guests")
const plusThreeGuests = document.querySelector("#plus-three-guests")
const newGame = document.querySelector("#new-game")
const periodNum = document.querySelector("#period-num")
const homeFouls = document.querySelector("#home-fouls-num")
const guestsFouls = document.querySelector("#guests-fouls-num")

// Initial values
let seconds = 0
let minutes = 0
let homeScoreCount = 0
let guestsScoreCount = 0
let periodCount = 0
let homeFoulsCount = 0
let guestsFoulsCount = 0
let play = true
let halfTime
let countDownId
let clickCount = 0
const timeout = 300

document.addEventListener("click", setNewGame)

// Function for setting values to 0
function setNewGame() {
	seconds = 0
	minutes = 48
	homeScoreCount = 0
	guestsScoreCount = 0
	periodCount = 0
	homeFoulsCount = 0
	guestsFoulsCount = 0

	halfTime = Math.floor(minutes / 2) - 1

	if (!play) {
		play = true
	}

	clearInterval(countDownId)
	timer.addEventListener("click", startTimer)
	document.removeEventListener("click", setNewGame)
	document.removeEventListener("click", countClicks)
	newGame.addEventListener("click", setNewGame)

// Function for changing values in DOM
	scoreTop()
	displayNums()
	displayTimer()
}

// Function for starting and stopping timer
function startTimer(e) {
// Events are activated when timer starts
	document.addEventListener("click", countClicks)

	if (minutes || seconds > 0) {
		if (play) {
			countDownId = setInterval(countTimer, 1000)
			play = false
		} else if (!play) {
			clearInterval(countDownId)
			play = true
		}
	}
}

// Function for counting and setting game period activated with setInterval()
function countTimer() {
	seconds--
	if (seconds < 0) {
		seconds = 59
		minutes--
	} else if (minutes < 1 && seconds < 1) {
		seconds = 0
		minutes = 0
		clearInterval(countDownId)
		timer.removeEventListener("click", startTimer)
		document.removeEventListener("click", countClicks)
	}

// Condition for Period number
	if (minutes > halfTime) {
		periodCount = 1
	} else {
		periodCount = 2
	}

	displayTimer()
	displayNums()
}

// Function for timer in the DOM
function displayTimer() {
	if (minutes < 10 && seconds < 10) {
		timer.textContent = `0${minutes}:0${seconds}`
	} else if (minutes < 10 && seconds > 9) {
		timer.textContent = `0${minutes}:${seconds}`
	} else if (seconds < 10) {
		timer.textContent = `${minutes}:0${seconds}`
	} else {
		timer.textContent = `${minutes}:${seconds}`
	}
}

// Function for single click and double click
function countClicks(e) {
	clickCount++
	if (clickCount === 1) {
		setTimeout(function() {
			if (clickCount === 1) {
				click(e)
			} else {
				dblClick(e)
			}
			clickCount = 0
		}, timeout || 200)
	}
}

function click(e) {
	addNums(e)
}

function dblClick(e) {
	subtractNums(e)
}

// Function for adding values such as scores
function addNums(e) {
	switch(e.target) {
		case homeScore:
			homeScoreCount++
			break
		case plusOneHome: case plusTwoHome: case plusThreeHome:
			homeScoreCount += +e.target.textContent.split("")[1]
			break
		case guestsScore:
			guestsScoreCount++
			break
		case plusOneGuests: case plusTwoGuests: case plusThreeGuests:
			guestsScoreCount += +e.target.textContent.split("")[1]
			break
		case homeFouls:
			homeFoulsCount++
			break
		case guestsFouls:
			guestsFoulsCount++
			break
	}

	if (homeScoreCount > 999) {
		homeScoreCount = 999
	} else if (guestsScoreCount > 999) {
		guestsScoreCount = 999
	}

	if (homeFoulsCount > 99) {
		homeFoulsCount = 99
	} else if (guestsFoulsCount > 99) {
		guestsFoulsCount = 99
	}
	scoreTop()
	displayNums()
}

// Function for subtracting values such as scores
function subtractNums(e) {
	switch(e.target) {
		case homeScore:
			homeScoreCount--
			break
		case plusOneHome: case plusTwoHome: case plusThreeHome:
			homeScoreCount -= +e.target.textContent.split("")[1]
			break
		case guestsScore:
			guestsScoreCount--
			break
		case plusOneGuests: case plusTwoGuests: case plusThreeGuests:
			guestsScoreCount -= +e.target.textContent.split("")[1]
			break
		case homeFouls:
			homeFoulsCount--
			break
		case guestsFouls:
			guestsFoulsCount--
			break
	}

	if (homeScoreCount < 0) {
		homeScoreCount = 0
	} else if (guestsScoreCount < 0) {
		guestsScoreCount = 0
	}

	if (homeFoulsCount < 0) {
		homeFoulsCount = 0
	} else if (guestsFoulsCount < 0) {
		guestsFoulsCount = 0
	}
	scoreTop()
	displayNums()
}

// Function for changing values in DOM
function displayNums() {
	homeScore.textContent = homeScoreCount
	guestsScore.textContent = guestsScoreCount
	periodNum.textContent = periodCount
	homeFouls.dataset.score = homeFoulsCount
	guestsFouls.dataset.score = guestsFoulsCount
}

// Function for backlight in the score buttons
function scoreTop() {
	homeScore.classList.remove("winning-score", "losing-score")
	guestsScore.classList.remove("winning-score", "losing-score")

	if (homeScoreCount > guestsScoreCount) {
		homeScore.classList.add("winning-score")
		guestsScore.classList.add("losing-score")
	} else if (homeScoreCount < guestsScoreCount) {
		guestsScore.classList.add("winning-score")
		homeScore.classList.add("losing-score")
	}
}




