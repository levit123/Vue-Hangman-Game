/*function for getting a random number */
function randomInteger(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Vue component for a keyboard letter button*/
Vue.component("letter-button",
{
	props: ["letter", "gameOver", "twoPlayers"],
	//defines the HTML element to append onto the webpage
	template: "<button class='keyboard-row-letter' :id='letter' :disabled='disabled' @click='clicked()'>{{ letter }}</button>",
	data: function()
	{
		return
		{
			disabled: false
		};
	},
	methods:
	{
		//function to disable the button when clicked, and send "check" event to run the "check()" method in the main Vue instance
		clicked: function()
		{
			this.disabled = true;
			this.$emit("check");
		}
	},
	watch:
	{
		/*this function disables all the buttons when getting a game over, and also
		re-enables all buttons upon restarting the game*/
		gameOver: function(newValue)
		{
			this.disabled = newValue;
		},
		//this function re-enables all buttons when a new two-player game is started
		twoPlayers: function(newValue)
		{
			this.disabled = false;
		}
	}
})

//main instance of the Vue app
var app = new Vue
({
	el: "#app",
	//defines the pieces of data used throughout the Vue app; think of them like properties
	data:
	{
		//2d array holding the keyboard letters
		letters:
		[
			["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
			["A", "S", "D", "F", "G", "H", "J", "K", "L"],
			["Z", "X", "C", "V", "B", "N", "M"]
		],
		//array holding the words to choose from
		words:
		[
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
	methods:
	{
		//function that draws the gallows on the webpage. takes in the "ctx" 2d context of the canvas
		drawGallows: function(ctx)
		{
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
		makeBlanks: function() 
		{
			//iterates through each character in the "currentWord" variable
			for (var i = 0; i < this.currentWord.length; i++)
			{
				this.wordDivs.push("");
			}
		},

		/*function that updates the canvas over time by drawing the appropriate part of the hanging man,
		and also handles if a game over occurs in the event the entire man is drawn*/
		updateCanvas: function(ctx)
		{
			//this.drawGallows(ctx);

			//if the user hasn't made any incorrect guesses yet, draw the head
			if (this.guesses === 0)
			{
				ctx.beginPath();
				ctx.arc(this.canvas.width * 0.4, (this.canvas.height / 5) + 20, 20, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.closePath();
			}
			//otherwise, if the user has made 1 incorrect guess, draw the torso
			else if (this.guesses === 1)
			{
				
			}
		}
	}
})