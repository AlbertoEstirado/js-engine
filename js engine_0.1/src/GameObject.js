class GameObject {

    Sprites = {
        animation: {
            path: "",
            image: null,
            loop: true,
            frames: 21,
            id: 0
        },
    };

    

    img = null;

    deltaTime = 0;
    frameRate = 0.04;
    currentDeltaTime = 0; 
    currentAnimation = null;

    constructor(position_x, position_y)
    {
        this.active = true;
        this.position_x = position_x;
        this.position_y = position_y;
        this.currentAnimation = this.Sprites.animation;
    }

    Start()
    {
// We load all the images
        this.LoadImages(this.Sprites, function(){});
    }

    Update(deltaTime)
    {
        this.deltaTime = deltaTime; 
        this.AnimationFrameRate(deltaTime);
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
        
    }

// Management of the framerate of the animations of the gameobjects
    AnimationFrameRate(deltaTime)
    {
        this.currentDeltaTime += this.deltaTime;

        if(this.currentDeltaTime > this.frameRate)
        {
            this.currentDeltaTime = 0;
            this.currentFrame++;
        }

        if(this.currentAnimation && this.currentAnimation.loop)
        {
            if(this.currentFrame > this.currentAnimation.frames-1)
            {
                this.currentFrame = 0;
            }
        }
        else
        {
            if(this.currentFrame > this.currentAnimation.frames-1)
            {
                this.SetActive(false);
            }
        }
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

// In case of having colider, it is taken into account
    SetActive(value)
    {
        this.active = value;

        if(this.collider)
        {
            this.collider.active = value;
        }
    }
}