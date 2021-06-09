
class Wall extends GameObject{

    speed = 220;
    previousWall = null;

    x = 0;

    topWall = {
        y: 0,
        width: 0,
        height: 0,
    }
    botWall = {
        y: 0,
        width: 0,
        height: 0,
    }
    pathPart = {
        y: 0,
        width: 0,
        height: 0,
    }

    maxHeight = canvas.height - 100;
    minHeight = 150;
    interval = 15;

    width = 0;
    spriteSize =  82;

    bossFight = false;

    bossConfiguration = 
    {
        y: 90,
        height: 395,
    }

    topCollider = null;
    botCollider = null;


    constructor(x, y, width, height)
    {
        super(x, y);

        super.Sprites = {
            sprite: {
                path: "assets/paralaxFondo/wall.png",
                image: null
            },
        };

        this.x = x;
        this.pathPart.y = y;
        this.pathPart.width = width;
        this.pathPart.height = height;
         
    }

    Start()
    {
        super.Start();
        this.img = this.Sprites.sprite.image;
        this.spriteSize = this.Sprites.sprite.image.width;
        this.spriteSize = 1;
        this.CalculateTopAndBot();

        this.topCollider = new BoxCollider(this, this.x, this.topWall.y, this.topWall.width, this.topWall.height, "wall", TYPE.STATIC);
        this.botCollider = new BoxCollider(this, this.x, this.botWall.y, this.botWall.width, this.botWall.height, "wall", TYPE.STATIC);
    }

    Update(deltaTime)
    {
        this.Movement(deltaTime);

        this.UpdateColliders();
    }
    
    UpdateColliders()
    {
        this.topCollider.position_x = this.x;
        this.topCollider.position_y = this.topWall.y;
        this.topCollider.width = this.topWall.width; 
        this.topCollider.height = this.topWall.height;

        this.botCollider.position_x = this.x;
        this.botCollider.position_y = this.botWall.y;
        this.botCollider.width = this.botWall.width;
        this.botCollider.height = this.botWall.height;
    }

    NetxWall(previousWall)
    {
        
        this.previousWall = previousWall;
        this.x = previousWall.x + previousWall.pathPart.width;

        if(!this.bossFight)
        {
            if(previousWall.pathPart.height > this.maxHeight)
            {
               this.pathPart.height = RandomRange(previousWall.pathPart.height - this.interval,
                previousWall.pathPart.height);
            }
            else if(previousWall.pathPart.height < this.minHeight)
            {
                this.pathPart.height = RandomRange(previousWall.pathPart.height,
                previousWall.pathPart.height + this.interval);
            }
            else
            {
                this.pathPart.height = RandomRange(previousWall.pathPart.height - this.interval,
                                             previousWall.pathPart.height + this.interval);
            }
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if(previousWall.pathPart.y < 0)
            {
                this.pathPart.y = RandomRange(previousWall.pathPart.y,
                previousWall.pathPart.y + this.interval );
            }
            else if(previousWall.pathPart.height + previousWall.pathPart.y > canvas.height)
            {
                this.pathPart.y = RandomRange(previousWall.pathPart.y  - this.interval,
                previousWall.pathPart.y);
            }
            else
            {   
                this.pathPart.y = RandomRange(previousWall.pathPart.y - this.interval,
                                             previousWall.pathPart.y + this.interval);
            }
        }
        else
        {
            this.pathPart.y = this.bossConfiguration.y;
            this.pathPart.height = this.bossConfiguration.height;
        }
        

        this.CalculateTopAndBot();

    }

    CalculateTopAndBot()
    {
        this.topWall.y = 0;
        this.topWall.width = this.pathPart.width;
        this.topWall.height = this.pathPart.y;

        this.botWall.width = this.pathPart.width;
        this.botWall.height = canvas.height - (this.pathPart.height + this.topWall.height);
        this.botWall.y = canvas.height - this.botWall.height;
    }

    Render(ctx)
    {
        ctx.save();

        ctx.drawImage(this.img, 0,0, 
            this.spriteSize, this.spriteSize, this.x, this.topWall.y, 
            this.topWall.width, this.topWall.height);

            ctx.drawImage(this.img, 0,0, 
                this.spriteSize, this.spriteSize, this.x, this.botWall.y, 
                this.botWall.width, this.botWall.height);

        ctx.restore();
    }

    Movement(deltaTime)
    {
        this.x += -1 * this.speed * deltaTime;
    }

   SetRun(value)
   {
        if(value)
        {
            this.speed = 380;
            this.interval = 40;
        }
        else
        {
            this.speed = 220;
            this.interval = 15;
        }
   }



}