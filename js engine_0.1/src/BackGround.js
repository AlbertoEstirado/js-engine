class BackGround extends GameObject {


    speed = 0;

    spriteSize =  112;


    constructor(position_x, position_y, speed, path)
    {
        super(position_x, position_y);

        this.speed = speed;

        super.Sprites = {
            sprite: {
                path: path,
                image: null,
                loop: true,
                frames: 1,
                id: 0
            },
        };

        this.currentAnimation = this.Sprites.sprite;
        
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.sprite.image;
        this.width = this.img.width;
        this.height = this.img.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;


        this.spriteSize = 1664;
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);
        this.Movement(deltaTime);
    }

    Render(ctx)
    {
        ctx.save();

        ctx.translate(this.position_x, this.position_y);
        
//Render the image twice for parallax 

        ctx.drawImage(this.img, 0,0, 
            this.spriteSize, this.spriteSize, this.position_x, this.position_y, 
            this.spriteSize, this.spriteSize);

        ctx.drawImage(this.img, 0,0, 
            this.spriteSize, this.spriteSize, this.position_x + canvas.width, this.position_y, 
            this.spriteSize, this.spriteSize);
        ctx.restore();
    }


    Movement(deltaTime)
    {
        this.position_x += -1 * this.speed * deltaTime;

//When it leaves the screen we restart it
        if(this.position_x < -canvas.width/2)
        {
            this.position_x = 0;
        }
    }

}