class Boss extends GameObject {
    
    health = 600;

    spriteSize =  112;
    currentFrame = 0;

    size = 150;

    colliderOffSet = 15;

    enterSpeed = 40;
    enter = false;
    fightMode = false;

    numberOfBulletsInPool = 40;
    bullets = [];

    shotRate = 3;
    shotRateAux = 0.2;

    lvl = 0;
    dir = 1;

    constructor(position_x, position_y)
    {
        super(position_x, position_y);

//We adjust all animations
        super.Sprites = {
            animation: {
                path: "assets/enemigos/boss_112px.png",
                image: null,
                loop: true,
                frames: 6,
                id: 0
            },
            enter: {
                path: "assets/enemigos/boss_112px.png",
                image: null,
                loop: true,
                frames: 24,
                id: 1
            },
            idle: {
                path: "assets/enemigos/boss_112px.png",
                image: null,
                loop: true,
                frames: 1,
                id: 1
            },
        };

        this.currentAnimation = this.Sprites.idle;

//We create pool of bullets
        for(let i = 0; i < this.numberOfBulletsInPool; i++)
        {
            this.bullets.push(new BossBullet(this.position_x + 600 * (i+1), this.position_y));
        }

        this.BulletPoolStart();
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.animation.image;
        this.width = 39;
        this.height = 38;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.spriteSize = 112;

        this.collider = new BoxCollider(this, this.position_x+this.colliderOffSet, this.position_y+this.colliderOffSet,
             this.spriteSize - this.colliderOffSet*2, this.spriteSize- this.colliderOffSet*2,"boss");

       
    }

    Render(ctx)
    {
        ctx.save();

        ctx.drawImage(this.img, this.currentFrame * this.spriteSize, 98 * this.currentAnimation.id, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSize);

        this.BulletPoolDraw(ctx);

        ctx.restore();
    }

    UpdateColliders()
    {
        this.collider.position_x = this.position_x+this.colliderOffSet;
        this.collider.position_y = this.position_y+this.colliderOffSet;
    }

   Update(deltaTime)
   {
       super.Update(deltaTime);

       if(this.enter)
        {
            this.EnterFight(deltaTime);
        }

        this.BulletPoolUpdate(deltaTime);

        
        if(this.fightMode && this.active)
        {
            this.UpdateColliders();

            this.shotRateAux += deltaTime;

            if(this.shotRateAux > this.shotRate)
            {
                this.shotRateAux = 0;
                this.Shot();
            }

            this.BossLvlConfiguration(deltaTime);
        }
   }

   OnTriggerEnter(other)
   {
       if(other.name != "bossBullet")
       {
            this.health -= 20;
            this.ManageHealth();
       }
   }

//Based on health we change the level
   ManageHealth()
   {
        if(this.health < 0 )
        {
            this.SetActive(false);
            game.EndGame();
        }
        else if(this.health <= 200)
        {
            this.lvl = 3;
        }
       if(this.health <= 300)
       {
            this.SetBulletsSpeed(350);
            this.shotRate = 0.2;
       }
       else if(this.health <= 400)
       {
            this.lvl = 2;
            this.SetBulletsSpeed(250);
            this.shotRate = 1;
       }
       else if(this.health <= 500)
       {
            this.lvl = 1;
            this.shotRate = 1.5;
       }
   }

   BossLvlConfiguration(deltaTime)
   {
        if(this.position_y > 370 )
        {
            this.dir = -1;
        }
        else if(this.position_y < 90)
        {
            this.dir = 1;
        }    


        if(game.boss.lvl == 0)
        {
            this.position_y += 10 * deltaTime * this.dir;
        }
        else if(game.boss.lvl == 1)
        {
            this.position_y += 50 * deltaTime * this.dir;
        }
        else if(game.boss.lvl >= 2  )
        {
            this.position_y += 150 * deltaTime * this.dir;

        }
   }

    BeginFight()
    {
        this.SetActive(true);
        this.enter = true;
        this.currentAnimation = this.Sprites.idle;

    }

    EnterFight(deltaTime)
    {
        this.position_x -= this.enterSpeed * deltaTime;

        if(this.position_x < 1400)
        {
            this.currentAnimation = this.Sprites.enter;
            audio_bossEntering.play();

        }

        if(this.position_x < 1360)
        {
            this.enter = false;
            this.currentAnimation = this.Sprites.animation;
            this.fightMode = true;

        }
    }
/***********************************************************BULLETS**********************************************************/
    BulletPoolUpdate(deltaTime)
    {
        this.bullets.forEach(element => {
            element.Update(deltaTime);
        });
    }

    BulletPoolDraw(ctx)
    {
        this.bullets.forEach(element => {
            element.Draw(ctx);
        });
    }

    BulletPoolStart()
    {
        this.bullets.forEach(element => {
            element.Start();
        });
    }

    Shot()
    {
        for(let i = 0; i < this.numberOfBulletsInPool; ++i) 
        {
            if(!this.bullets[i].active)
            {
                this.bullets[i].Shot(this.position_x , this.position_y + 40);
                this.shotRateAux = 0;
                i = this.numberOfBulletsInPool;
            }
        }
    }

    SetBulletsSpeed(speed)
    {
         this.bullets.forEach(element => {
         element.SetSpeed(speed);
         });
    }
}