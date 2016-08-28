var Render = (function () {

	var containerId = 'container',
	canvas,
	context,
	//ctx, // ALERT! <--- no.


	drawLock = function (ctx) {

		// draw lock path
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 21;
		ctx.beginPath();
		ctx.arc(320, 240, 100, 0, Math.PI * 2);
		ctx.stroke();

		// draw pointer
		//x = Math.cos(lock.pointer) * 100 + 320;
		//y = Math.sin(lock.pointer) * 100 + 240;
		x = Math.cos(lock.pick.click * (Math.PI / (lock.divs / 2))) * 100 + 320;
		y = Math.sin(lock.pick.click * (Math.PI / (lock.divs / 2))) * 100 + 240;

		ctx.fillStyle = '#a0a000';
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();

		// draw tumbler
		x = Math.cos(lock.tumbler * (Math.PI / (lock.divs / 2))) * (100 - 15) + 320;
		y = Math.sin(lock.tumbler * (Math.PI / (lock.divs / 2))) * (100 - 15) + 240;

		ctx.fillStyle = '#a0a000';
		ctx.strokeStyle = '#ffff00';
		ctx.lineWidth = 11;
		ctx.beginPath();

		ctx.moveTo(x, y);
		ctx.lineTo(

			Math.cos(lock.tumbler * (Math.PI / (lock.divs / 2))) * (100 + 15) + 320,
			Math.sin(lock.tumbler * (Math.PI / (lock.divs / 2))) * (100 + 15) + 240);
		ctx.stroke();
		ctx.fill();

		// info
		ctx.fillStyle = '#000000';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		ctx.font = '15px courier';
		//ctx.fillText('pointer radian: '+lock.pointer.toFixed(2), 10,10);
		ctx.fillText('pick click: ' + lock.pick.click, 10, 10);
		ctx.fillText('tumbler click: ' + lock.tumbler, 10, 30);
		ctx.fillText('winOrLoose: ' + lock.winOrLoose, 10, 50);
		ctx.fillText('win: ' + lock.win, 10, 70);
		ctx.fillText('user tap: ' + lock.userTap, 10, 90);
		//ctx.fillText('current state: ' + currentState, 10, 110);
		ctx.fillText('trip up count: ' + lock.tripCount, 10, 130);

	},

	drawLockTitle = function(ctx){
		
	    drawCasp(ctx,320,240);
		
		// draw lock path
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 21;
		ctx.beginPath();
		ctx.arc(320, 240, 100, 0, Math.PI * 2);
		ctx.stroke();
	},
	
	drawCountDisplay = function (ctx, x, y) {

		// draw count display
		ctx.fillStyle = '#ffffff';
		ctx.textBasleline = 'top';
		ctx.textAlign = 'center';
		ctx.font = '50px arial';
		ctx.fillText(lock.count, x, y - 25);

	},

	drawCasp = function (ctx, x, y, unlockPer) {

		if (!unlockPer) {
			unlockPer = 0;
		}

		var radian = Math.PI * 1.5,

		caspHeightChange = 50 * unlockPer,
		caspHeight = 40 + caspHeightChange,

		sx = Math.cos(radian) * 30 + (x - 50),
		sy = Math.sin(radian) * 30 + (y - 50);

		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 21;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(
			Math.cos(radian) * caspHeight + sx,
			Math.sin(radian) * caspHeight + sy);
		ctx.arc(
			Math.cos(radian) * caspHeight + sx + 50,
			Math.sin(radian) * caspHeight + sy,
			50,
			Math.PI, 0);
		ctx.lineTo(sx + 100, sy - caspHeightChange);

		ctx.stroke();

	};

	return {
		
		setup : function () {

			canvas = document.createElement('canvas');
			context = canvas.getContext('2d');
			ctx = context;
			canvas.width = 640;
			canvas.height = 480;

			document.getElementById(containerId).appendChild(canvas);

			canvas.addEventListener('touchstart', function (e) {
				
				var box = this.getBoundingClientRect(),
				x = e.touches[0].clientX - box.left,
				y = e.touches[0].clientY - box.top;
				
				e.preventDefault();
				
				if(!Slider.getSceneById(Main.getState()).user_action(e,x,y)){
				
				    lock.userTap = true;
				
				}
					
					
					
				

			});
			canvas.addEventListener('mousedown', function (e) {
				
				var box = this.getBoundingClientRect(),
				x = e.clientX - box.left,
				y = e.clientY - box.top;
				
				e.preventDefault();
				
				
				if(!Slider.getSceneById(Main.getState()).user_action(e,x,y)){
				
				    lock.userTap = true;
				
				}
			});

		},
		draw : function (appState) {

		
		    this['draw_appState_'+appState](context);
		    //if(appState === 'game'){
			    
				
            
			//}
		},
		
		draw_appState_title : function(ctx){
			
			var scene = Slider.getSceneById('title');
			
			ctx.fillStyle = '#002020';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			drawLockTitle(ctx);
			scene.renderAll(ctx);
		},
		
		draw_appState_options : function(ctx){
			
			var scene = Slider.getSceneById('options');
			
			ctx.fillStyle = '#002020';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			scene.renderAll(ctx);
		},
		
		draw_appState_game : function(){
			
			var scene = Slider.getSceneById('game');
			
			this['draw_lockState_'+lock.currentState](context);
			
			scene.renderAll(ctx);
		},
		
		draw_lockState_gameStart : function (ctx) {

			ctx.fillStyle = '#008080';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCasp(ctx, 320, 240);
			drawLock(ctx);
			drawCountDisplay(ctx, 320, 240);
		},
		draw_lockState_runStart : function (ctx) {

			ctx.fillStyle = '#008080';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCasp(ctx, 320, 240);
			drawLock(ctx);
			drawCountDisplay(ctx, 320, 240);
		},
		draw_lockState_nextCount : function (ctx) {

			ctx.fillStyle = '#008080';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCasp(ctx, 320, 240);
			drawLock(ctx);
			drawCountDisplay(ctx, 320, 240);
		},

		draw_lockState_game : function (ctx) {

			ctx.fillStyle = '#008080';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCasp(ctx, 320, 240);
			drawLock(ctx);
			drawCountDisplay(ctx, 320, 240);

		},
		draw_lockState_win : function (ctx) {

			ctx.fillStyle = '#00ff00';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCasp(ctx, 320, 240, lock.effectFrame / lock.effectMaxFrame);
			drawLock(ctx);
			drawCountDisplay(ctx, 320, 240);
		},
		draw_lockState_runOver : function (ctx) {

			ctx.fillStyle = '#af0000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.save();
			ctx.translate(320, 240);
			ctx.rotate(lock.effectRadian);
			drawCasp(ctx, 0, 0);
			drawCountDisplay(ctx, 0, 0);
			ctx.restore();

			drawLock(ctx);

		}

	};

}
	());
