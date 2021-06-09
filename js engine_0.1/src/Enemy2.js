class Enemy2 extends GameObject {

    health = 1;

    colliderOffSet = 0;

    speed = 100;

    spriteSize =  71;
    
    currentFrame = 0;

    amplitud = 50;
    longitud = 0.5;

    shotRate = 1;
    shotRateAux = 0.2;

    numberOfBulletsInPool = 5;
    bullets = [];

    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            animation: {
                path: "assets/enemigos/enemigo2_71x64px.png",
                image: null,
                loop: true,
                frames: 16,
                id: 1
            },
            destroy: {
                path: "assets/enemigos/enemigo2_71x64px.png",
                image: null,
                loop: false,
                frames: 21,
                id: 0
            },
        };

        this.currentAnimation = this.Sprites.animation;

        for(let i = 0; i < this.numberOfBulletsInPool; i++)
        {
            this.bullets.push(new EnemyBullet(this.position_x + 600 * (i+1), this.position_y));
        }

        this.BulletPoolStart();
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.animation.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.Randomize();

        this.collider = new BoxCollider(this, this.position_x+this.colliderOffSet, this.position_y+this.colliderOffSet,
             this.spriteSize - this.colliderOffSet*2, this.spriteSize - this.colliderOffSet*2,"enemy");
    }

    Randomize()
    {
        this.longitud = RandomRange(0.2, 1.5);
        this.amplitud  = RandomRange(30, 60);
    }

    OnTriggerEnter(other)
    {
        if(other.name != "wall" && other.name != "enemyBullet" && other.name != "enemy")
        {
            this.DealDamage();
        }
    }

    DealDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            this.currentAnimation = this.Sprites.destroy;
            this.collider.active = false;
        }

    }

    Update(deltaTime)
    {
        super.Update(deltaTime);

        this.BulletPoolUpdate(deltaTime);

        if(this.active)
        {
            this.Movement(deltaTime);

            this.UpdateColliders();

            this.shotRateAux += deltaTime;

            if(this.shotRateAux > this.shotRate)
            {
                this.shotRateAux = 0;
                this.Shot();
            }
        }
    }

    Movement(deltaTime)
    {
        
        this.position_y = this.position_y + Math.cos((this.position_x / canvas.width)* this.amplitud) * this.longitud;

        this.position_x -= this.speed * deltaTime;

        if(this.position_x < 0)
        {
            this.SetActive(false);
        }
            
    }

    UpdateColliders()
    {
        this.collider.position_x = this.position_x+this.colliderOffSet;
        this.collider.position_y = this.position_y+this.colliderOffSet;
    }

    Render(ctx)
    {
        ctx.save();

        ctx.drawImage(this.img, this.currentFrame * this.spriteSize, this.spriteSize * this.currentAnimation.id, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSize);

        ctx.restore();
    }

    Draw(ctx)
    {
        super.Draw(ctx);

        this.BulletPoolDraw(ctx);

    }

    SetActive(value)
    {
        this.active = value;
        this.currentAnimation = this.Sprites.animation;

        if(this.collider)
        {
            this.collider.active = value;
        }
    }

    /***********************************************************BULLETS**********************************************************/

    SetBulletHell(value)
    {
        if(value)
        {
            this.shotRate = 1;
        }
        else
        {
            this.shotRate = 2;
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

    Shot()
    {
        for(let i = 0; i < this.numberOfBulletsInPool; ++i) 
        {
            if(!this.bullets[i].active)
            {
                this.bullets[i].Shot(this.position_x , this.position_y + (this.spriteSize/4));
                this.shotRateAux = 0;
                i = this.numberOfBulletsInPool;
            }
        }
    }
    

}