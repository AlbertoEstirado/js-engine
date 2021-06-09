class UISprite{

    Sprites = {
        sprite: {
            path: "",
            image: null,
            loop: false
        },
    };

    img = null;

    spriteSize = 100;
    scale = 1;
    value = 1;

    constructor(x, y, scale,  path , width, height)
    {
        this.active = true;
        this.position_x = x;
        this.position_y = y;
        this.scale = scale;
        this.Sprites.sprite.path = path;
        this.width = width;
        this.height = height;
        this.LoadImages(this.Sprites, function(){});
    }

    Start()
    {
        if(this.Sprites.sprite.path != "")
        {
            this.img = this.Sprites.sprite.image;
        }
    }

    Update()
    {
        if(this.active)
        {
            if(Input.IsMousePressed() && 
            Input.mouse.x < this.width + this.position_x &&
            Input.mouse.x > this.position_x && 
            Input.mouse.y < this.height + this.position_y &&
            Input.mouse.y > this.position_y )
            {
                this.Execute();
            }
        }
        
    }

    Execute()
    {
// This function should be overwritten when we create the object
    }

    Draw(ctx)
    {
        if(this.active)
        {
            this.Render(ctx);
        }
    }

    Render(ctx)
    {
        ctx.save();

        if(this.Sprites.sprite.path != "")
        {
            ctx.drawImage(this.img, 0,0, 
                this.width*this.value,  this.height, this.position_x, this.position_y, 
               this.width*this.scale, this.height*this.scale);
        }
        else
        {
            ctx.fillStyle = "rgba(255,121,0,1)";
            ctx.fillRect(this.position_x, this.position_y, this.width, this.height);
        }
        
        ctx.restore();
    }

    SetSize(x, y, width, height) 
    {
        this.position_x = x;
        this.position_y = y;
        this.width = width;
        this.height = height;
    }

    LoadImages(assets, onloaded)
    {
        let imagesToLoad = 0;
        
        const onload = () => --imagesToLoad === 0 && onloaded();

        // iterate through the object of assets and load every image
        for (let asset in assets)
        {
            if (assets.hasOwnProperty(asset))
            {
                imagesToLoad++; // one more image to load

                // create the new image and set its path and onload event
                const img = assets[asset].image = new Image;
                img.src = assets[asset].path;
                img.onload = onload;
            }
        }
        return assets;
    }
}