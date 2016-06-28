// Dice Definitions
var dice = [
		{
			"name":"Dice One",
			"colour":"green",
			"sides":[1,5,1,1,5,5],
			"selected":false
		},
		{
			"name":"Dice Two",
			"colour":"red",
			"sides":[2,6,2,6,2,2],
			"selected":false
		},
		{
			"name":"Dice Three",
			"colour":"yellow",
			"sides":[3,3,3,3,3,3],
			"selected":false
		},
		{
			"name":"Dice Four",
			"colour":"purple",
			"sides":[4,4,4,4,0,0],
			"selected":false
		}
	];

// Game
function DiceGame(diceSet)
{
	this.dice = diceSet;
	this.visuals = [];

	this.running = false;
	this.counter = 0;
	this.iterations = 100;
	this.result = [];
	this.wins = [];

	this.threaded=true;

	this.Setup = function()
	{
		for(var i=0; i<this.dice.length; ++i)
		{
			var div = document.createElement("div");
			div.className = "dice";
			div.setAttribute("onclick","GAME.diceClick("+i+");");
			div.style.background = this.dice[i].colour;
			var html = 
				"<div class='dicetitle'>"+this.dice[i].name+"</div>"
				+"<div class='dicesides'>";
				for (var z=0; z<this.dice[i].sides.length; ++z)
				{
					if (z>0)
						html=html+", ";
					html=html+this.dice[i].sides[z];
				}
				html=html+"</div>";
			div.innerHTML = html;
			div.id = "dice-"+i;
			//document.getElementById('available-dice').appendChild(div);
			this.visuals[i]=div;
		}
		this.Refresh();
	}

	this.Refresh = function()
	{
		for (var i=0; i<this.dice.length; ++i)
		{
			var a = document.getElementById('available-dice');
			var s = document.getElementById('selected-dice');
			var v = this.visuals[i];
			if (this.dice[i].selected)
			{
				try
				{
					a.removeChild(v);
				}
				catch(e)
				{
					// not found - ignore
				}
				s.appendChild(v);
			}
			else
			{
				try
				{
					s.removeChild(v);
				}
				catch(e)
				{
					// not found - ignore
				}
				a.appendChild(v);
			}
		}
	}

	this.diceClick = function(id)
	{
		this.dice[id].selected = this.dice[id].selected ? false : true;
		this.Refresh();
	}

	this.Reset = function()
	{
		for (var i=0; i<this.dice.length; ++i)
			this.dice[i].selected=false;
		this.clearVisual();
		this.Refresh();
		document.getElementById('iterations').value = "100";
	}

	this.clearVisual = function()
	{
		document.getElementById('headline').innerHTML = "";
		document.getElementById('console').innerHTML = "";
	}

	this.Start = function()
	{
		this.clearVisual();
		this.running=true;
		this.iterations=document.getElementById('iterations').value;
		this.counter=0;
		this.result=[];
		var cDice=0;
		for (var i=0; i<this.dice.length; ++i)
		{
			this.wins[i]=0;
			this.result[i]=0;
			if (this.dice[i].selected)
				cDice++;
		}
		if (cDice < 2)
		{
			alert('Must select at least 2 dice to run simulation with');
		}
		else
		{
			this.Go();
		}
	}

	this.Go = function()
	{
		if (this.counter >= this.iterations)
		{
			this.running=false;
			// Endex
		}
		else
		{
			this.counter++;
			var roll = [];
			var highest = -1;
			var winner = -1;
			var text = "";
			for(var i=0; i<this.dice.length; ++i)
			{
				roll[i] = 0;
				if (this.dice[i].selected)
				{
					var side = Math.floor(Math.random() * this.dice[i].sides.length);
					roll[i]=this.dice[i].sides[side];
					if (roll[i] > highest)
					{
						highest=roll[i];
						winner=i;
					}
					text = text + this.dice[i].name+" rolls "+roll[i]+", ";
				}
			}
			text = text + this.dice[winner].name+" wins with a "+highest;
			this.wins[winner]++;
			this.addConsole(text);
			this.updateScores();
		}

		if (this.threaded)
		{
			var that=this;
			setTimeout(
				function() {
					that.Go();
				}
				,1);
		}
		else
		{
			this.Go();
		}
	}

	this.addConsole = function(t)
	{
		document.getElementById('console').innerHTML += "<br />\n"+t;
	}

	this.updateScores = function()
	{
		var d = document.getElementById('headline');
		var t = "";
		for (var i=0; i<this.dice.length; ++i)
		{
			if (this.dice[i].selected)
			{
				var l = this.dice[i].name + " has won " + this.wins[i] + " / " + this.counter + " = ";
				var p = 0;
				if (this.wins[i]>0 && this.counter>0)
				{
					p = (this.wins[i]/this.counter)*100;
				}
				l = l + Math.floor(p) + " %<br />";
				t = t+l;
			}
		}
		d.innerHTML = t;
	}
}

// Start Off

var GAME = null;

function Start()
{
	GAME = new DiceGame(dice);
	GAME.Setup();
}