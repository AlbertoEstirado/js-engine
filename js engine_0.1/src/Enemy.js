class Enemy extends GameObject {

    health = 5;

    colliderOffSet = 0;

    speed = 180;

    spriteSize =  41;
    
    currentFrame = 0;

    amplitud = 50;
    longitud = 0.5;

    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            animation: {
                path: "assets/enemigos/enemigo1_41px.png",
                image: null,
                loop: true,
                frames: 16,
                id: 0
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

        this.Randomize();

        this.collider = new BoxCollider(this, this.position_x+this.colliderOffSet, this.position_y+this.colliderOffSet,
             this.spriteSize - this.colliderOffSet, this.spriteSize - this.colliderOffSet,"enemy");
    }

    Randomize()
    {
        this.longitud = RandomRange(0.2, 1.5);
        this.amplitud  = RandomRange(30, 60);
    }

    OnTriggerEnter(other)
    {
        if(other.name == "player")
        {
            this.SetActive(false);
        }
        else if(other.name != "wall" && other.name != "enemyBullet")
        {
            this.DealDamage();
        }
        
    }

    DealDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            this.SetActive(false);
            this.health = 5;
        }

    }

    Update(deltaTime)
    {
        super.Update(deltaTime);

        if(this.active)
        {
            this.Movement(deltaTime);

            this.UpdateColliders();
        }
        
    }

    Movement(deltaTime)
    {
        
        this.position_y = this.position_y + Math.cos((this.position_x / canvas.width)* this.amplitud) * this.longitud;

        this.position_x -= this.speed * deltaTime;

        if(this.position_x + this.width < 0)
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

        ctx.drawImage(this.img, this.currentFrame * this.spriteSize-5,0, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize*1.7, this.spriteSize*1.7);

        ctx.restore();
    }

    

}