class Explosion extends GameObject {


    spriteSize = 74;
    currentFrame = 0;

    constructor(position_x, position_y)
    {
        super(position_x, position_y);

        super.Sprites = {
            animation: {
                path: "assets/player/explosion.png",
                image: null,
                loop: false,
                frames: 6,
                id: 0
            },
        };

        this.currentAnimation = this.Sprites.animation;
        this.active = false;
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.animation.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);
        

    }

    PlayExplosion(position_x, position_y)
    {
        audio_explosion.play();
        this.position_x = position_x;
        this.position_y = position_y;
        this.currentFrame = 0;
        this.active = true;
    }

    Render(ctx)
    {
        ctx.save();

        ctx.drawImage(this.img, this.currentFrame * this.spriteSize,0, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSize);
        ctx.restore();
    }

  
    

}