/*function for getting a random number */
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Vue component for a keyboard letter button*/
Vue.component("letter-button", {
	props: ["letter", "gameOver", "twoPlayers"],
	//defines the HTML element to append onto the webpage
	template: "<button class='keyboard-row-letter' :id='letter' :disabled='disabled' @click='clicked()'>{{ letter }}</button>",
	data: function() {
	    return {
	        disabled: false
	    };
	},
	methods: {
		//function to disable the button when clicked, and send "check" event to run the "check()" method in the main Vue instance
		clicked: function() {
			this.disabled = true;
			this.$emit("check");
		}
	},
	watch: {
		/*this function disables all the buttons when getting a game over, and also
		re-enables all buttons upon restarting the game*/
		gameOver: function(newValue) {
			this.disabled = newValue;
		},
		//this function re-enables all buttons when a new two-player game is started
		twoPlayers: function(newValue) {
			this.disabled = false;
		}
	}
})

//main instance of the Vue app
var app = new Vue({
	el: "#app",
	//defines the pieces of data used throughout the Vue app; think of them like properties
	data: {
		//2d array holding the keyboard letters
		letters: [
			["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
			["A", "S", "D", "F", "G", "H", "J", "K", "L"],
			["Z", "X", "C", "V", "B", "N", "M"]
		],
		//array holding the words to choose from
		words: [
			"BUTTERCUP",
			"TANSY",
			"PIGEON",
			"REPTILE",
			"HAWK",
			"CAPYBARA",
			"DELICATE",
			"OFFICIAL",
			"ALIMONY",
			"GRANOLA",
			"IMPERATIVE",
			"DELICIOUS",
			"ANTICIPATION",
			"APPLE",
			"BANANA",
			"BILIOUS",
			"INTESTINE",
			"AMPLIFY"
		],

		//variable that will be set to a random word from the above array
		currentWord: "",
		//each element in this array is an individual letter in the above "currentWord" variable
		wordDivs: [],
		//variable that counts the number of incorrect guesses
		guesses: 0,
		//variable that says whether the game is over or not
		gameOver: false,
		//variable that says whether the player has lost or not
		lose: false,
		//variable that says whether there's two players or not
		twoPlayers: false,
		//will be set to the canvas element in the "mounted()" function
		canvas: "",
		//will be set to the 2d context of the canvas
		ctx: ""
	},

	//defines the functions of the main Vue app
	methods: {
		//function that draws the gallows on the webpage. takes in the "ctx" 2d context of the canvas
		drawGallows: function(ctx) {
			//clears anything currently on the canvas
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//defines the fill color of the drawing
			ctx.fillStyle = "#FF9800";
			//defines the stroke (in other words, the line itself) color of the drawing
			ctx.strokeStyle = "##FF9800";
			ctx.beginPath();
			//draws the left side
			ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
			ctx.lineTo(this.canvas.width / 10, this.canvas.height * 0.95);
			//draws the bottom side
			ctx.lineTo(this.canvas.width * 0.8, this.canvas.height * 0.95);
			//draws the top side
			ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
			ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 10);
			//draws the hanging notch
			ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 5);
			ctx.stroke();
			ctx.closePath();
		},

		//function that fills the "wordDivs" with empty strings to create orange blanks for each letter
		makeBlanks: function() {
			//iterates through each character in the "currentWord" variable
			for (var i = 0; i < this.currentWord.length; i++) {
				this.wordDivs.push("");
			}
		},

		/*function that updates the canvas over time by drawing the appropriate part of the hanging man,
		and also handles if a game over occurs in the event the entire man is drawn*/
		updateCanvas: function(ctx) {
			//this.drawGallows(ctx);

			//if the user hasn't made any incorrect guesses yet, draw the head
			if (this.guesses === 0) {
				ctx.beginPath();
				ctx.arc(this.canvas.width * 0.4, (this.canvas.height / 5) + 20, 20, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 1 incorrect guess, draw the torso
			else if (this.guesses === 1) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 40);
				ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 2 incorrect guesses, draw the right leg
			else if (this.guesses === 2) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.lineTo((this.canvas.width * 0.4) + 30, this.canvas.height * 0.7);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 3 incorrect guesses, draw the left leg
			else if (this.guesses === 3) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.lineTo((this.canvas.width * 0.4) - 30, this.canvas.height * 0.7);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 4 incorrect guesses, draw the right arm
			else if (this.guesses === 4) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 55);
				ctx.lineTo((this.canvas.width * 0.4) + 35, (this.canvas.height / 2) + 10);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 5 incorrect guesses, draw the left arm and end the games
			else if (this.guesses === 5) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 55);
				ctx.lineTo((this.canvas.width * 0.4) - 35, (this.canvas.height / 2) + 10);
				ctx.stroke();
				ctx.closePath();

				//chooses a font for the game over message
				ctx.font = "24px Roboto, sans-serif";
				//displays the game over message
				ctx.fillText("Game Over Man, Game Over!", this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
				//specifies that the game has ended and the player has lost
				this.gameOver = true;
				this.lose = true;

				for (var i = 0; i < this.currentWord.length; i++) {
					Vue.set(this.wordDivs, i, this.currentWord[i]);
				}
			}
			//increment the amount of incorrect guesses the player has made
			this.guesses++;
		},

		//function to check the chosen letter when a letter component emits 'check'
		check: function(letter) {
			if (!this.gameOver) {
				var guessCorrect = false;
				//iterates through the letters in the word
				for (var i = 0; i < this.currentWord.length; i++) {
					//if the user's chosen letter matches with the current letter in the word, fill it in
					if (letter == this.currentWord[i]) {
						//fills in the letter in the word
						Vue.set(this.wordDivs, i, letter);
						//determines that the player has correctly guessed a letter
						guessCorrect = true;
					}
				}

				//if there are no more blanks in the word, the player wins
				if (!this.wordDivs.some(function(value) { return value == "" })) {
					//determines that the game is over
					this.gameOver = true;
					//chooses a font for the winning message
					this.ctx.font = "24px Roboto, sans-serif";
					//displays the winning message
					this.ctx.fillText("Congratulations, you won! Click here for a free iPhone!", this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
				}
				//if they guess wrong, call the "updateCanvas" function to draw the man
				if (!guessCorrect) {
					this.updateCanvas(this.ctx);
				}
			}
		},

		//function to re-initialize the game
		restart: function() {
			//resets all the aspects of the game app
			this.gameOver = false;
			this.lose = false;
			this.guesses = 0;
			this.wordDivs.splice(0);
			//call the function to re-draw the gallows
			this.drawGallows(this.ctx);
			//call the function to display the blank letters for the word
			this.makeBlanks();
		},

		//function to start the game to one-player mode and choose a new word
		onePlayer: function() {
			//if the game move is currently two-player...
			if (this.twoPlayers == true) {
				//determines that the game is not two-player anymore
				this.twoPlayers = false;
				//chooses a random word from the list of possible words
				this.currentWord = this.words[randomInteger(0, this.words.length - 1)];
				this.restart();
			}
		},

		//function to start the game in two-player mode and prompt the user to enter a word
		twoPlayer: function() {
			if (!this.twoPlayers) {
				//determines that the game is over
				this.gameOver = true;
				//determines that the game is in two-player mode
				this.twoPlayers = true;
				this.wordDivs.splice(0);

				//attempts to read user input for a word
				try {
					this.currentWord = prompt("Enter a word!").toUpperCase();
				}
				//if an exception occurs, such as the user inputs something invalid...
				catch (e) {
					//calls the function to make the game one-player
					this.onePlayer();
					return;
				}
				//a collection of all alphabetical characters, uppercase and lowercase
				var letters = /^[A-Za-z]+$/;
				//if the user input contains characters that are not letters...
				while (!letters.test(this.currentWord)) {
					//attempts to read user input for a word again
					try {
						this.currentWord = prompt("Only letters please! Enter a word: ").toUpperCase();
					}
					//if an exception occurs...
					catch(e) {
						//calls the function to make the game one-player
						this.onePlayer();
						return;
					}
				}
				this.restart();
			}
		},

		playAgain: function() {
			//if the game mode is currently two-player...
			if (this.twoPlayers == true) {
				//attempts to read user input for a word
				try {
					this.currentWord = prompt("Enter a word!").toUpperCase();
				}
				//if an exception occurs, such as the user inputs something invalid...
				catch (e) {
					//calls the function to make the game one-player
					this.onePlayer();
					return;
				}
				//a collection of all alphabetical characters, uppercase and lowercase
				var letters = /^[A-Za-z]+$/;
				//if the user input contains characters that are not letters...
				while (!letters.test(this.currentWord)) {
					//attempts to read user input for a word again
					try {
						this.currentWord = prompt("Only letters please! Enter a word: ").toUpperCase();
					}
					//if an exception occurs...
					catch(e) {
						//calls the function to make the game one-player
						this.onePlayer();
						return;
					}
				}
			}
			//otherwise, if the game mode is not currently two-player...
			else {
				this.currentWord = this.words[randomInteger(0, this.words.length - 1)];
			}
			this.restart();
		}
	},

	//function to identify the canvas element and initialize it, draw the gallows, choose a word, and draw the blanks
	mounted: function() {
		this.canvas = document.getElementById("board-canvas");
		this.canvas.width = document.getElementById("board").offsetWidth;
		this.canvas.height = document.getElementById("board").offsetHeight;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineWidth = 2;
		this.drawGallows(this.ctx);
		this.currentWord = this.words[randomInteger(0, this.words.length - 1)];
		this.makeBlanks();
	}
});