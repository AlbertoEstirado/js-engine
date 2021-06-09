class EnemyBullet extends GameObject {


    speed = 350;

    spriteSize =  112;

    explosion = null;

    collider = null;

    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            sprite: {
                path: "assets/enemigos/enemyBullet.png",
                image: null,
                frames: 1,
                id: 0
            },
            
        };

        this.currentAnimation = this.Sprites.sprite;
        this.explosion = new Explosion(-50,-50);

        this.active = false;
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.sprite.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.spriteSize = this.width;
        this.spriteSize = 22;

        this.collider = new BoxCollider(this, this.position_x, this.position_y, this.spriteSize, this.spriteSize, "enemyBullet");

        this.explosion.Start();

        
    } 

    OnTriggerEnter(other)
    {
        if(other.name != "enemy" && other.name != "enemyBullet")
        {
            this.collider.active = false;
            this.trigger = false;
            this.explosion.PlayExplosion(this.position_x, this.position_y -this.height);
            this.active = false;
            this.position_y = -100;
        }
        
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);

        this.explosion.Update(deltaTime);

        if(this.active)
        {
            this.position_x -= this.speed * deltaTime;
        }

        this.UpdateColliders();  
 
        if(this.position_x < 0)
        {
            this.active = false;
        }
    }

    UpdateColliders()
    {
        this.collider.position_x = this.position_x;
        this.collider.position_y = this.position_y;
    }

    Render(ctx)
    {
        ctx.save();


        ctx.drawImage(this.img, 0,0, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSize);


        ctx.restore();

    }

    Draw(ctx)
    {
        super.Draw(ctx);

        this.explosion.Render(ctx);
    }

    Shot(position_x, position_y)
    {

        audio_enemyShoot.play();
        this.position_x = position_x;
        this.position_y = position_y;
        this.active = true;
        this.collider.active = true;
        
        this.collider.trigger = true;
    }
}