gameState = {
    BOSSFIGHT : "bossFight",
    STANDARD : "standard",
    BULLETHELL: "bulletHell",
    RUN: "run"
}

var game = 
{
    uiObjects: [],

    gameObjects: [],
    walls: [],
    enemys: [],
    enemys2: [],

    numberOfWalls: 52,
    poolOfEnemys: 10,

    
    deltaTime: 0,
    delayTimeToSpawnEnemy: 0,
    delayTimeToSpawnEnemy2: 0,

    timeToSpawnEnemy: 0,
    timeToSpawnEnemy2: 0,

    timeToSpawnEnemyBulletHell: 0,
    timeToSpawnEnemy2BulletHell: 0,

    timeToChangeMode: 30,
    delayToChangeMode: 0,
    mode: 0,

    complete: false,

    state: null,

    menuStartButton: null,
    menu: null,
    onGame:false,

    Start:function()
    {
        this.state = gameState.STANDARD;

        this.LoadData();
        audioManager.LoadSounds();

        this.Menu();

        
        this.menuStartButton.onclick  = function() {
            game.HideMenuAndStart();

        };
    },

    Menu()
    {
        this.menuStartButton = document.getElementById("startButton");
        this.menu = document.getElementById("menu");
    },

    HideMenuAndStart()
    {
        this.menu.style.left = "-" + this.menu.clientWidth + "px";

        this.StartGame();
    },

    StartGame()
    {
        audio_song.play();

        this.onGame = true;
        this.collisionManager = new CollisionsManager();

//---------UI----------
        this.healthSprite = new UISprite(12, 10, 0.7, "assets/player/healthSprite.png", 176, 32);
        this.uiObjects.push(this.healthSprite);

        this.healthBarContainer = new UISprite(3, 45, 0.7, "assets/player/healthBarContainer_69px.png", 276, 32);
        this.uiObjects.push(this.healthBarContainer);

        this.healthBar = new UISprite(3, 45, 1, "");
        this.uiObjects.push(this.healthBar);
        this.healthBar.SetSize((this.healthBar.position_x + 5), (this.healthBar.position_y + 6), 256*0.7, 16 * 0.7);

        this.levelComplete = new UISprite(canvas.width/2-230, canvas.height/2-100, 1, "assets/hud/levelComplete.png", 402, 108);
        this.uiObjects.push(this.levelComplete);
        this.levelComplete.active = false;

        this.gameOver = new UISprite(canvas.width/2-110, canvas.height/2-55, 1, "assets/hud/gameOver.png", 204, 106);
        this.uiObjects.push(this.gameOver);
        this.gameOver.active = false;

        this.tryAgain = new UISprite(canvas.width/2 - 55, canvas.height/2+100, 1, "assets/hud/tryAgain.png", 96, 51);
        this.uiObjects.push(this.tryAgain);
        this.tryAgain.active = false;

        this.tryAgain.Execute = function(){
            game.ResetGame();
        }

//----------GAMEOBJECTS-----------
        this.backGround1 = new BackGround(0,0,10, "assets/paralaxFondo/fondo1.png");
        this.gameObjects.push(this.backGround1);

        this.backGround4 = new BackGround(0,0,2, "assets/paralaxFondo/fondo4.png");
        this.gameObjects.push(this.backGround4);

        this.backGround2 = new BackGround(0,20,50, "assets/paralaxFondo/fondo2.png");
        this.gameObjects.push(this.backGround2);
 
        this.backGround3 = new BackGround(0,20,100, "assets/paralaxFondo/fondo3.png");
        this.gameObjects.push(this.backGround3);

        this.boss = new Boss(1800, canvas.height/2 -40);
        this.gameObjects.push(this.boss);
        this.boss.SetActive(false);


        for(let i = 0; i < this.poolOfEnemys; ++i)
        {
            let enemy = new Enemy(1350, 200);
            enemy.SetActive(false);
            this.enemys.push(enemy);
            this.gameObjects.push(enemy);
        }

        for(let i = 0; i < this.poolOfEnemys; ++i)
        {
            let enemy = new Enemy2(1350, 200);
            enemy.SetActive(false);
            this.enemys2.push(enemy);
            this.gameObjects.push(enemy);
        }

        this.player = new Player(50,150);
        this.gameObjects.push(this.player); 

//We generate the walls
        this.wall = new Wall(0, 32, 32, 430);
        this.GenerateWalls(this.wall);

//----------START-----------
        this.gameObjects.forEach(element => {
            element.Start();
        });

        this.walls.forEach(element => {
            element.Start();
        })

        this.uiObjects.forEach(element => {
            element.Start();
        });
    },

    Update: function(deltaTime)
    {
// First we execute the update of all GameObjects and then we check the collisions
        if(this.onGame)
        {
            this.gameObjects.forEach(element => {
                element.Update(deltaTime);
            });
    
            this.walls.forEach(element => {
    
                if(element.x < 0 - element.pathPart.width)
                {
                    element.NetxWall(this.GetFarthestWall());
                }
            })
    
            this.walls.forEach(element => {
                element.Update(deltaTime);
            })
    
            this.collisionManager.Update(deltaTime);
    
            this.GameLoop(deltaTime);
    
            this.uiObjects.forEach(element => {
                element.Update(deltaTime);
            });
        }
        
    },

    Draw: function(contex)
    {
        contex.clearRect(0, 0, canvas.width, canvas.height);
        
        this.gameObjects.forEach(element => {
            element.Draw(contex);
        });
        this.walls.forEach(element => {
            element.Draw(contex);
        });

        this.uiObjects.forEach(element => {
            element.Draw(contex);
        });

        if(this.onGame)
        {
            //this.collisionManager.DebugDraw(contex);
        }
        
    },

    GenerateWalls: function(wall)
    {
// The walls are generated based on the last wall
        this.walls.push(wall);

        for(let i = 0; i < this.numberOfWalls; i++)
        {
            let pW = this.walls[this.walls.length - 1];
            let newWall = new Wall(pW.x, pW.pathPart.y, pW.pathPart.width, pW.pathPart.height);
            
            newWall.NetxWall(pW);
            this.walls.push(newWall);

            if(i == 1) 
            {
                this.wall.previousWall = pW;
            }
        }
    },

    GetFarthestWall: function()
    {
        let farthestWall = null;
        this.walls.forEach(element => {
            if(farthestWall == null){ farthestWall = element; }

            if(farthestWall.x < element.x)
            {
                farthestWall = element;
            }
        });

        return farthestWall;
    },

    SetBossConfiguration: function(state) 
    {
        this.walls.forEach(element => {
            element.bossFight = state;
        });
    },

    SpawnEnemy(enemys)
    {
// We search the pool of enemies for the first one available and activate it
        for(let i = 0; i < this.enemys.length; ++i)
        {
            if(!enemys[i].active)
            {
                enemys[i].position_x = canvas.width;
                enemys[i].position_y = RandomRange(90, 395);
                enemys[i].SetActive(true);
                enemys[i].Randomize();
                i = enemys.length;
            }
        }
    },

    GameLoop(deltaTime)
    {
        this.ManageGameMode(deltaTime);

        if(this.state == gameState.STANDARD)
        {
            this.GameStandard(deltaTime);
        }
        else if(this.state == gameState.BOSSFIGHT)
        {
            this.GameBossFight(deltaTime);
        }
        else if(this.state == gameState.RUN)
        {
            this.GameRun(deltaTime);
        }
        else if(this.state == gameState.BULLETHELL)
        {
            this.GameBulletHell(deltaTime);
        }
    },

    ManageGameMode(deltaTime)
    {
// We change the game mode when X time has passed
        this.delayToChangeMode += deltaTime;

        if(this.delayToChangeMode > this.timeToChangeMode && this.mode == 2)
        {
            this.SetBossFight();
            this.mode++;

        }
        else if(this.delayToChangeMode > this.timeToChangeMode && this.mode == 1)
        {
            this.SetRun();
            this.delayToChangeMode = 0;
            this.mode++;
        }
        else if(this.delayToChangeMode > this.timeToChangeMode && this.mode == 0)
        {
            this.SetBulletHell();
            this.delayToChangeMode = 0;
            this.mode++;
        }
    },

    GameStandard(deltaTime)
    {
        this.delayTimeToSpawnEnemy += deltaTime;
        this.delayTimeToSpawnEnemy2 += deltaTime;

        if(this.delayTimeToSpawnEnemy > this.timeToSpawnEnemy)
        {
            this.delayTimeToSpawnEnemy = 0;
            this.SpawnEnemy(this.enemys);
            //console.log("####SPAWN####");
        }

        if(this.delayTimeToSpawnEnemy2 > this.timeToSpawnEnemy2)
        {
            this.delayTimeToSpawnEnemy2 = 0;
            this.SpawnEnemy(this.enemys2);
            //console.log("####SPAWN####");
        }
    },

    GameBossFight(deltaTime){},

    GameRun(deltaTime){},

    GameBulletHell(deltaTime)
    {
        this.delayTimeToSpawnEnemy += deltaTime;
        this.delayTimeToSpawnEnemy2 += deltaTime;

        if(this.delayTimeToSpawnEnemy > this.timeToSpawnEnemyBulletHell)
        {
            this.delayTimeToSpawnEnemy = 0;
            this.SpawnEnemy(this.enemys);
            //console.log("####SPAWN####");
        }

        if(this.delayTimeToSpawnEnemy2 > this.timeToSpawnEnemy2BulletHell)
        {
            this.delayTimeToSpawnEnemy2 = 0;
            this.SpawnEnemy(this.enemys2);
            //console.log("####SPAWN####");
        }
    },

    SetBulletHell()
    {
        this.state = gameState.BULLETHELL;

        this.SetBossConfiguration(false);

        this.enemys2.forEach(element => {
            element.SetBulletHell(true);
        });

        this.walls.forEach(element => {
            element.SetRun(false);
        });

    },

    SetBossFight()
    {
        this.state = gameState.BOSSFIGHT;

        this.boss.BeginFight();

        this.SetBossConfiguration(true);

        this.walls.forEach(element => {
            element.SetRun(false);
        });
    },

    SetStandard()
    {
        this.state = gameState.STANDARD;

        this.SetBossConfiguration(false);

        this.enemys2.forEach(element => {
            element.SetBulletHell(false);
        });

        this.walls.forEach(element => {
            element.SetRun(false);
        });
    },

    SetRun()
    {
        this.state = gameState.RUN;

        this.SetBossConfiguration(false);

        this.walls.forEach(element => {
            element.SetRun(true);
        });
    },

    EndGame()
    {
        if(!this.gameOver.active)
        {
            this.levelComplete.active = true;
            this.complete = true;
        }
    },

    GameOver()
    {
        this.gameOver.active = true;
        this.tryAgain.active = true;
    },

    LoadData()
    {
        var data = JSON.parse(lvlConfiguration);

        
        this.timeToSpawnEnemy = data.level1[0].timeToSpawnEnemy;
        this.timeToSpawnEnemy2 = data.level1[0].timeToSpawnEnemy2;

        this.timeToSpawnEnemyBulletHell = data.level1[1].timeToSpawnEnemy;
        this.timeToSpawnEnemy2BulletHell = data.level1[1].timeToSpawnEnemy2;

    },

    ResetGame()
    {
        this.uiObjects = [];
        this.gameObjects = [];
        this.walls = [];
        this.enemys = [];
        this.enemys2 = [];

        game.HideMenuAndStart();
    }

}