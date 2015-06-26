;(function() {
	'use strict';
	function LineRunner(gameDiv_) 
	{
		var gameDiv = gameDiv_;
		var interval = 100;
		var background = new Background();
		var hero = new Hero();	
		var gundas = [];
		var gunda = new Gunda();
		var gameOver = false;
		var heroTop = 200;
		var loopCounter = 0;
		var isCrawl = false;
		var isJump = false;
		var crawlCounter = 0;
		var jumpCounter =0;
		var scoreboard =new scoreBoard();
		var score = 0;
		var isGameOver=false;
		var gameProps = {
			width: 800,
			height: 512
	};

		
	function Background() 
	{
		var that = this;
		
		this.element  = document.createElement('div');
		this.element.style.width = '50000px';
		this.element.style.height = '512px';
		this.element.style.background = 'url(gamebg.jpg) repeat-x';		
		var marginLeft = 0;

		var move = function() {
			marginLeft -= 2;
		};
		
		var render = function() {
			that.element.style.marginLeft = marginLeft + 'px';
		};
		
		this.updateFrame = function() {	
			move();
			render();
		};
	};

	function scoreBoard()
	{
		var that= this;
		this.element = document.createElement('div');
		this.element.style.position = 'absolute';
		this.element.style.top='100px';
		this.element.style.left='500px';
		this.element.style.color='white';
		this.updateFrame = function() {
			that.element.innerHTML = "Score: " + score;
		};
		
	};
	
	function Hero() 
	{
		var that = this;
		
		this.element  = document.createElement('div');
		//this.element.style.border = '1px solid blue';
		this.element.style.background = 'url(img.png) no-repeat';
		this.element.style.position = 'absolute';
		
		this.x = 0;
		this.y = 0;
		
		this.height = 150;
		this.width = 70;
		
		
		
		this.updateFrame = function() {
			that.element.style.left = that.x + 'px';
			that.element.style.top = that.y + 'px';
			
			that.element.style.width = that.width + 'px';
			that.element.style.height = that.height + 'px';
			heroMove(); //added here		
		};

		this.gravity=function() {
			that.y += 3;

			if (that.y+hero.height >= gameProps.height) {
				that.y = gameProps.height - hero.height;
			}
			if (isCrawl){
				crawlCounter++;
			}

			if(crawlCounter >= 50){
				that.height = 150;
				that.y = gameProps.height - that.height;
				isCrawl = false;
				crawlCounter = 0;
			}
			if (isJump){
				jumpCounter++;
			}

			if(jumpCounter >= 50){
				that.height = 150;
				that.y = gameProps.height - that.height;
				isJump = false;
				jumpCounter = 0;
			}				
		}

		var bgMove = 0;
	
		var heroMove = function(){
			that.element.style.backgroundPosition = bgMove + 'px';
			bgMove = bgMove - 70;
			if (bgMove === -4*70){
				//console.log("here");
				bgMove =0;			
			}			
		};

		this.jump =function() {
			if(!isJump){
				isCrawl = false;
				crawlCounter = 0;
				that.height = 150;
				that.y -= 130;
				isJump = true;
			}
			
		}

		this.crawl = function () {
			isCrawl = true;
			if(that.height === 150) {
				that.height = 100;
				that.y = gameProps.height - that.height;
			}
		};

		this.collisionDetection = function() {
				// check collision of HERO with ALL ENEMIES
			for (var i =0;i<gundas.length;i++){
				var currentGundaX = gundas[i].x;
				var currentGundaY = gundas[i].y;
				var currentGundaWidth=gundas[i].width;
				var currentGundaHeight= gundas[i].height;			
			}

			if (currentGundaX < 0){
				score++;//out of bounds			
			}
			else{
				if ((hero.x+hero.width) > currentGundaX && hero.x < (currentGundaX+currentGundaWidth)){
					if((hero.y+hero.height)>currentGundaY && hero.y < (currentGundaY+currentGundaHeight)){
						alert("Game Over!!!!!");
						isGameOver = true;
					};			
						
				};
			};
		};

	};
	
	function Gunda() 
	{
		var that = this;
		
		this.element  = document.createElement('div');
		this.element.style.border = '1px solid red';
		this.element.style.position = 'absolute';
		this.element.style.background = 'black';

			
		this.height = 40;
		this.width = 40;

		this.x = 800 - this.height;
		if(Math.random() < 0.5){
				this.y = 512 - this.width;
			}else{
				this.y = 512 - this.width - 110;
			}
		this.move = function() {
			// move left continuously
			that.x -= 5;
		};
		
		this.updateFrame = function() {
			that.move();
			that.element.style.left = that.x + 'px';

			that.element.style.top = that.y + 'px';
			
			that.element.style.width = that.width + 'px';
			that.element.style.height = that.height + 'px';
		};
	};
	
		
	var gameSetup = function() {
			gameDiv.style.width = gameProps.width + 'px';
			gameDiv.style.height = gameProps.height + 'px';
			gameDiv.style.border = '1px solid black';
			gameDiv.style.overflow = 'hidden';
		
			hero.y = gameProps.height - hero.height;
			hero.x = 250;
				
			gameDiv.appendChild(background.element);
			gameDiv.appendChild(scoreboard.element);			
			gameDiv.appendChild(hero.element);

			window.onkeydown = function(event)
			{
				if(event.which === 38){
					hero.jump();
				}else if(event.which === 40){
					hero.crawl();
				}
			};
	};
		
		var createGunda = function() {
				//console.log("creating a gunda");
				var gunda = new Gunda();
				gameDiv.appendChild(gunda.element);
				gundas.push(gunda);
		};
		
		
		
		var gameLoop = function() {
			if (!isGameOver){
				loopCounter++;
				
				background.updateFrame();
				scoreboard.updateFrame();
				hero.updateFrame();
				
				if (loopCounter % (200) === 0) {
					createGunda();	
				}
				
				for (var i=0; i<gundas.length; i++) {

					var gunda = gundas[i];
					gunda.updateFrame();
				}
				hero.gravity();
				hero.collisionDetection();
			}
		};
		
		
		var getRandom = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		
		gameSetup();
		setInterval(gameLoop, interval);
	};

	
	
	window.LineRunner = LineRunner;
})();
