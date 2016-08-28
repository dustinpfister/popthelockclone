var lock = (function () {

	// the lock model
	return lock = {

		frameRate : 1000 / 60,
		lastFrame : new Date(),
		divs : 80, // the number of times that Math.PI * 2 is to be divided
		click : 0, // a radian amount of one div (like degrees, only Math.PI / (this.divs / 2) rather than Math.PI / 180 )

		pick : {
			clockwise : true,
			click : 0, // the current click position
			delta : 1 // number of clicks to move per frame ( 0, 1, or -1)
		},

		// tumbler
		tumbler : 0,
		tumblerRange : 2, // the distance in clicks the pick must be within to win
		tripUp : false,
		tripChance : 0.2, // chance of a trip up
		tripClicks : 15, // number of clicks a trip up is places in front of the pick
		tripCountRange : [5, 10], // trip up count range
		tripCount : 0,

		// game state
		winOrLoose : false,
		win : false,
		userTap : false,
		maxCount : 1,
		count : 1,

		// rendering
		effectRadian : 0,
		effectMaxRadian : 1,
		effectFrame : 0,
		effectMaxFrame : 20,

		
		currentState : 'gameStart',
		
		update : function(){
			
			this.state[this.currentState].call(this);
			
		},
		
		setCount : function (count) {

			if (count) {
				this.maxCount = count
			}

			this.currentState = 'gameStart';
			this.count = this.maxCount;
			this.winOrLoose = false;
			this.win = false;
			this.userTap = false;

			this.effectFrame = 0;

			// set click based on current number of divs
			this.click = Math.PI * 2 / this.divs;

			// set click position to starting location
			this.pick.click = Math.floor(this.divs / 4) * 3;

			// set clockwise or counter clockwise delta
			this.pick.clockwise = Boolean(Math.floor(Math.random() * 2))
				//this.pick.delta = 1 - 2 * Number(this.pick.clockwise);
				this.pick.delta = 0;

			// set tumbler position
			this.tumbler = this.pick.click + this.divs / 5 + Math.floor(Math.random() * this.divs / 5 * 3);

			// check tumbler
			this.tumbler = this.tumbler >= this.divs ? this.tumbler - this.divs : this.tumbler;
            this.tumbler = this.tumbler < 0 ? this.tumbler + this.divs : this.tumbler;
			
			
			// clear any pre existing trip up
			this.tripUp = false;
			this.tripCount = 0;

		},

		nextCount : function () {

			var roll;

			this.effectFrame = 0;

			if (this.count > 0) {

				this.winOrLoose = false;
				this.win = false;
				this.userTap = false;

				//this.clockwise = !this.clockwise;
				this.pick.clockwise = !this.pick.clockwise;

				//this.pointerDelta = this.click * (1 - 2 * Number(!this.clockwise) );
				this.pick.delta = 1 - 2 * Number(this.pick.clockwise);

				// set new tumbler position

				if (this.tripUp) {

					if (this.pick.delta > 0) {

						this.tumbler = this.pick.click + this.tripClicks;

					} else {

						this.tumbler = this.pick.click - this.tripClicks;

					}

					this.tripCount--;
					if (this.tripCount <= 0) {

						this.tripCount = 0;
						this.tripUp = false;
					}

				} else {

					roll = Math.random();

					if (roll < this.tripChance) {

						this.tripUp = true;
						this.tripCount = Math.round(Math.random() * (this.tripCountRange[1] - this.tripCountRange[0])) + this.tripCountRange[0];

					}

					this.tumbler = this.pick.click + this.divs / 5 + Math.floor(Math.random() * this.divs / 5 * 3);
					
				}
				
				// check tumbler
				this.tumbler = this.tumbler >= this.divs ? this.tumbler - this.divs : this.tumbler;
                this.tumbler = this.tumbler < 0 ? this.tumbler + this.divs : this.tumbler;

			}

		},

		updateEffect : function () {

			if (this.effectFrame <= this.effectMaxFrame) {

				// set current effect radian
				this.effectRadian = this.effectMaxRadian / this.effectMaxFrame * api.halfDistance(this.effectMaxFrame, this.effectFrame, 0);

				// have rotation go with pick
				this.effectRadian = this.effectRadian * (1 - (2 * Number(this.pick.clockwise)));

				this.effectFrame++;

			}

		},

		state : {

			gameStart : function () {

				this.setCount();

				this.currentState = 'runStart';
			},

			nextCount : function () {

				if (this.count > 0) {

					this.nextCount();
					this.currentState = 'game';

				} else {

					this.userTap = false;
					this.currentState = 'win'
				}

			},

			runStart : function () {

				if (this.userTap) {

					this.pick.delta = 1 - 2 * Number(this.pick.clockwise);
					this.currentState = 'game';

				}

				this.userTap = false;
			},

			runOver : function () {

				if (this.userTap && this.effectFrame === this.effectMaxFrame + 1) {

					this.currentState = 'gameStart';
					this.effectFrame = 0;
				}

				// rotation effect
				this.updateEffect();
				this.userTap = false;
			},

			win : function () {

				if (this.userTap && this.effectFrame === this.effectMaxFrame + 1) {

					this.maxCount++;
					this.currentState = 'gameStart';

				}

				// rotation effect
				this.updateEffect();

				this.userTap = false;
			},

			game : function () {

				var angle;

				//this.pointer += this.pointerDelta;

				// step click
				this.pick.click += this.pick.delta;

				// check click
				this.pick.click = this.pick.click < 0 ? this.divs + this.pick.click : this.pick.click;
				this.pick.click = this.pick.click >= this.divs ? this.pick.click - this.divs : this.pick.click;

				// if the pin is in range of the tumbler
				//if(Math.abs(this.tumbler - this.pick.click) <= this.tumblerRange){
				if (api.halfDistance(this.divs, this.pick.click, this.tumbler) <= this.tumblerRange) {

					this.winOrLoose = true;

					if (this.userTap) {

						//this.pointerDelta = 0;
						this.pick.delta = 0;
						this.win = true;

					}
				} else {

					if (this.userTap) {

						this.pick.delta = 0;
						this.win = false;

					}

					if (this.winOrLoose) {

						this.pick.delta = 0;
						this.win = false;

					}

				}

				if (this.pick.delta === 0) {

					this.userTap = false;

					if (this.win) {

						this.count--;

						if (this.count < 0) {
							this.count = 0;
						}
						this.currentState = 'nextCount';

					} else {

						this.currentState = 'runOver';

					}

				}

			}

		}

	};

}
	());