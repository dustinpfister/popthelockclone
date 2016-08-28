



var Main = (function () {

	var appState = 'game',

	start = function () {

	    // set up renderer
		Render.setup();

		// set up slider scenes.
		
		// title Scene
		Slider.addScene(
		    
			{
				id: 'title',
				render: function(ctx, scene){
					
					ctx.fillStyle='#ffffff';
					ctx.fillRect(this.x,this.y,this.w,this.h);
					
				}
			},
			
			[
			    { // Start Game Button
					updateMethod : 'moveDistance',
					sx:640,
					sy:380,					
					w:150,
					h:50,
					distanceX : -200,
					
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('Start Game', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					
					onEnd : function(){
						
						lock.setCount();
						appState = 'game';
						
					}
					
				},
				
				{ // Start Game Button
					updateMethod : 'moveDistance',
					sx:-200,
					sy:380,					
					w:150,
					h:50,
					distanceX : 250,
					
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('options', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					
					onEnd : function(){
						
						lock.setCount();
						appState = 'options';
						
					}
					
				}
			
			]
		
		);
		
		// game scene
		Slider.addScene(
		    
			{
				id: 'game',
				render: function(ctx, scene){
					
					ctx.fillStyle='#ffffff';
					ctx.fillRect(this.x,this.y,this.w,this.h);
					
				}
			},
			
			[
			    { // Quit Button
					updateMethod : 'moveDistance',
					sx:640,
					sy:30,
					
					w:75,
					h:75,
					distanceX : -110,
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('quit', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					onEnd : function(){
						
						appState = 'title';
						
					}
					
				}
			
			]
		
		);
		
		// game options
		Slider.addScene(
		    
			{
				id: 'options',
				render: function(ctx, scene){
					
					ctx.fillStyle='#ffffff';
					ctx.fillRect(this.x,this.y,this.w,this.h);
					
				}
			},
			
			[
			    { // back Button
					updateMethod : 'moveDistance',
					sx:640,
					sy:30,
					
					w:75,
					h:75,
					distanceX : -110,
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('back', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					onEnd : function(){
						
						appState = 'title';
						
					}
					
				},
				
				
				
				{ // starting count up
				    type : 'action',
					updateMethod : 'moveDistance',
					sx:-200,
					sy:250,
					
					w:150,
					h:75,
					distanceX : 250,
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('+', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					onAction : function(){
						
						
						
						lock.maxCount++;
						if(lock.maxCount > 100){
							
							lock.maxCount = 100;
							
						}
						
					}
					
				},
				{ // starting count down
				    type : 'action',
					updateMethod : 'moveDistance',
					sx:-200,
					sy:325,
					
					w:150,
					h:75,
					distanceX : 250,
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('-', this.x + this.w/2, this.y + this.h/2 - 10);
					
				    },
					onAction : function(){
						
						lock.maxCount--;
						if(lock.maxCount <= 0){
							
							lock.maxCount = 1;
							
						}
						
						
					}
					
				},
				{ // count display
				    type : 'dummy',
					updateMethod : 'moveDistance',
					sx:640,
					sy:250,
					
					w:150,
					h:150,
					distanceX : -450,
					render: function(ctx, scene){
					
					    ctx.strokeStyle='#000000';
						ctx.fillStyle='#000000';
					    ctx.lineWidth = 3;
						ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					    ctx.textAlign='center';
						ctx.textBaseline = 'top';
						ctx.font = '20px arial';
					    ctx.fillText('count:' + lock.maxCount, this.x + this.w/2, this.y + this.h/2 - 10);
					
				    }
					
				}
			
			]
		
		);
		
		// start app on state title
		appState = 'title';

		// run main app loop
		loop();
	},

	state = {
		
		title : function(){
			
			Slider.getSceneById('title').update();
			
		},
		
		options : function(){
			
			Slider.getSceneById('options').update();
			
		},
		
		game : function(){
			
			Slider.getSceneById('game').update();
			lock.update();
			
		}
		
		
	},
	
	loop = function () {

		requestAnimationFrame(loop);

		if (new Date() - lock.lastFrame > lock.frameRate) {
			
			state[appState]();
			Render.draw(appState);

			lock.lastFrame = new Date();
		}

	};

	start();
	
	
	return {
		
		getState : function(){
			
			return appState;
			
		}
		
	};

}
	());