class BossBullet extends GameObject {


    speed = 150;

    spriteSize =  112;

    explosion = null;

    collider = null;

    rotation = 0;
    rotationSpeed = 2;

    amplitud = 50;
    longitud = 3;

    
    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            sprite: {
                path: "assets/enemigos/bossBullet.png",
                image: null,
                frames: 1,
                id: 0
            },
            
        };

        this.currentAnimation = this.Sprites.sprite;

//We add an explosion to the bullet
        this.explosion = new Explosion(-50,-50);

        this.active = false;
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.sprite.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = 39 / 2;
        this.halfHeight = 38 / 2;
        this.spriteSize = 39;

        this.collider = new BoxCollider(this, this.position_x, this.position_y, this.width, this.height, "bossBullet");

        this.explosion.Start();

        
    } 

    OnTriggerEnter(other)
    {
        if(other.name != "enemy" && other.name != "enemyBullet" && other.name != "boss" && other.name != "bossBullet" && other.name != "wall")
        {
            this.SetActive(false);
            this.trigger = false;
            this.explosion.PlayExplosion(this.position_x, this.position_y -this.height);
            this.position_y = -100;
        }
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);

        this.explosion.Update(deltaTime);

        if(this.active)
        {
            this.BulletLvlConfiguration(deltaTime);
            this.UpdateColliders(); 
        }
 
        if(this.position_x < 0)
        {
            this.SetActive(false);
        }
    }

//Based on the level of the boss they have a different behavior
    BulletLvlConfiguration(deltaTime)
    {
        this.position_x -= this.speed * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        if(game.boss.lvl == 0)
        {
            this.position_y = this.position_y + Math.cos((this.position_x / canvas.width)* this.amplitud) * this.longitud;
        }
        else if(game.boss.lvl == 1)
        {
            this.position_x -= this.speed * deltaTime;
            this.rotation += this.rotationSpeed * deltaTime;
        }
        else if(game.boss.lvl == 3)
        {
            this.position_y = this.position_y + Math.cos((this.position_x / canvas.width)* this.amplitud) * this.longitud;
        }
    }

    UpdateColliders()
    {
        this.collider.position_x = this.position_x - this.halfWidth;
        this.collider.position_y = this.position_y - this.halfHeight;
    }

    Render(ctx)
    {
        ctx.save();

        ctx.translate(this.position_x, this.position_y);
        ctx.rotate(this.rotation)
        ctx.drawImage(this.img, -this.halfWidth, -this.halfHeight, this.spriteSize, this.spriteSize)

        ctx.restore();

    }

    Draw(ctx)
    {
        super.Draw(ctx);

        this.explosion.Render(ctx);
    }

    Shot(position_x, position_y)
    {
        audio_bossShoot.play();
        this.position_x = position_x;
        this.position_y = position_y;
        this.UpdateColliders();
        this.active = true;
        this.collider.active = true;
        
        this.collider.trigger = true;
    }

    SetSpeed(speed)
    {
        this.speed = speed;
    }


}