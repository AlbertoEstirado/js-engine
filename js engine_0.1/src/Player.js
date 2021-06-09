
class Player extends GameObject {

    speed = 150;
    health = 200;
    maxHealth = 200;

    spriteSize =  82;
    spriteSizeY = 72;
    currentFrame = 0;

    width = 0;
    height = 0;
    halfWidth = 0;
    halfHeight = 0;

    bullets = []; 
    numberOfBulletsInPool = 25;  
    shotRate = 0.3;
    shotRateAux = 0.2;

    colliderOffSet = 25;


    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            animation: {
                path: "assets/player/player_82px.png",
                image: null,
                loop: true,
                frames: 7,
                id: 0
            },
            move: {
                path: "assets/player/player_82px.png",
                image: null,
                loop: true,
                frames: 6,
                id: 1
            },
        };

        this.currentAnimation = this.Sprites.animation;
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.animation.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        for(let i = 0; i < this.numberOfBulletsInPool; i++)
        {
            this.bullets.push(new Bullet(this.position_x + 600 * (i+1), this.position_y));
        }

        this.BulletPoolStart();

        this.collider = new BoxCollider(this, this.position_x+this.colliderOffSet, this.position_y+this.colliderOffSet,
             this.spriteSize - this.colliderOffSet*2, this.spriteSize - this.colliderOffSet*2,"player");
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);
        this.BulletPoolUpdate(deltaTime);
        if(!game.complete)
        {
            this.Movement(deltaTime);
            
            this.Shoot(deltaTime);
            this.UpdateColliders();

            if(this.position_x < 0 || this.position_x > canvas.width ||
                 this.position_y < 0 || this.position_y > canvas.height )
            {
                this.health = this.health - 2;
                this.ManageHealth();
            }
        }
    }
    
    Draw(ctx)
    {
        super.Draw(ctx);
        this.BulletPoolDraw(ctx);
    }

    Render(ctx)
    {
        ctx.save();

        ctx.drawImage(this.img, this.currentFrame * this.spriteSize, this.spriteSizeY * this.currentAnimation.id, 
            this.spriteSize, this.spriteSizeY, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSizeY);

        ctx.restore();
    }

    UpdateColliders()
    {
        this.collider.position_x = this.position_x + this.colliderOffSet+5;
        this.collider.position_y = this.position_y + this.colliderOffSet -5;
    }

    Movement(deltaTime)
    {
        
        let dir = Vector2.Zero();
        //dir.y = 1;
        this.currentAnimation = this.Sprites.animation
        
        if (Input.IsKeyPressed(KEY_UP) || Input.IsKeyPressed(KEY_W))
        {
            dir.y = -1;
            this.currentAnimation = this.Sprites.move
        }
        if (Input.IsKeyPressed(KEY_RIGHT) || Input.IsKeyPressed(KEY_D))
        {
            dir.x = 1;
            this.currentAnimation = this.Sprites.move
        }
        if (Input.IsKeyPressed(KEY_LEFT) || Input.IsKeyPressed(KEY_A))
        {
            dir.x = -1;
        }
        if (Input.IsKeyPressed(KEY_DOWN) || Input.IsKeyPressed(KEY_S))
        {
            dir.y = 1;
        }
        
        //if(dir != Vector2.Zero()){this.currentAnimation = this.Sprites.move}
        let currentSpeed = this.speed;

        //this.position_x += dir.y * currentSpeed * deltaTime;
        this.position_y += dir.y * currentSpeed * deltaTime;
        this.position_x += dir.x * currentSpeed * deltaTime;
    }

    Shoot(deltaTime)
    {
        this.shotRateAux += deltaTime;

        if (Input.IsKeyPressed(KEY_SPACE) && (this.shotRateAux >= this.shotRate))
        {
            for(let i = 0; i < this.numberOfBulletsInPool; ++i) 
            {
                if(!this.bullets[i].active)
                {
                    this.bullets[i].Shot(this.position_x + (this.spriteSize), this.position_y + (this.spriteSize/4));
                    this.shotRateAux = 0;
                    i = this.numberOfBulletsInPool;
                }
            }
        }
    }

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

    OnTriggerEnter(other)
    {
        this.DealDamage(other);
    }

    DealDamage(other)
    {
        if(other.name == "wall")
        {
            this.health = this.health - 2;
            audio_collision.play();
        }
        if(other.name == "enemy")
        {
            this.health = this.health - 40;
        }
        if(other.name == "enemyBullet")
        {
            this.health = this.health - 10;
        }
        if(other.name == "bossBullet")
        {
            this.health = this.health - 20;
        }

        this.ManageHealth();

    }

    ManageHealth()
    {
        let currentPercent = this.health / this.maxHealth * 100;

        let bar = currentPercent * (256*.7) /100;
        if(bar < 0)
        {
            bar = 0;
        }
        game.healthBar.width = bar;

        if(this.health <= 0)
        {
            game.GameOver();
            this.SetActive(false);
        }
    }
}