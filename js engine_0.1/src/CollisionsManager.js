
//References to all colliders
worldColliders = [];
wordlStaticColliders = [];
worldDynamicColliders = [];

TYPE = 
    {
        DYNAMIC : "dynamic",
        STATIC : "static"
    }

class CollisionsManager
{
    constructor(){}

    Update(deltaTime)
    {
// We check the dynamic colliders with all the other colliders
        for(let i = 0; i < worldDynamicColliders.length; i++)
        {
            for(let j = i+1; j < worldColliders.length; j++)
            {
                if(worldDynamicColliders[i].active && worldColliders[j].active)
                {
                    this.CheckCollisions(worldDynamicColliders[i], worldColliders[j]);
                }
            }
        }
    }

    CheckCollisions(boxCollider1, boxCollider2)
    {

        let left1 = boxCollider1.position_x;
        let right1 = boxCollider1.position_x + boxCollider1.width;
        let bot1 = boxCollider1.position_y;
        let top1 = boxCollider1.position_y + boxCollider1.height; 

        let left2 = boxCollider2.position_x;
        let right2 = boxCollider2.position_x + boxCollider2.width;
        let bot2 = boxCollider2.position_y;
        let top2 = boxCollider2.position_y + boxCollider2.height; 
 
        if((right1 >= left2 && left1 <= right2 && top1 >= bot2 && bot1 <= top2) ||  
            (right2 >= left1 && left2 <= right1 && top2 >= bot1 && bot2 <= top1))
        {
            if(boxCollider1.trigger)
            {
                    boxCollider1.OnTriggerEnter(boxCollider1, boxCollider2);
            }
            if(boxCollider2.trigger)
            {
                    boxCollider2.OnTriggerEnter(boxCollider2, boxCollider1);
            }
        }

    }

    DebugDraw(ctx)
    {
        worldColliders.forEach(element => {
            element.DebugDraw(ctx);
        });
    }
}


class BoxCollider
{
    object = null;
    name = "";
    trigger = true;
    active = false;

    type = null;

    constructor(obj, position_x, position_y, width, height, name = "", type = TYPE.DYNAMIC)
    {
        this.object = obj;
        this.position_x = position_x;
        this.position_y = position_y;
        this.width = width;
        this.height = height; 
        this.name = name;
        this.active = obj.active;
        this.type = type;

//We add colliders to the list based on their type as soon as we create them
        if(this.type == TYPE.DYNAMIC)
        {
            worldDynamicColliders.push(this);
        }
        else
        {
            wordlStaticColliders.push(this);
        }
        worldColliders.push(this);
    }

    OnTriggerEnter(self, other)
    { 
        if(this.active)
        {
// It is necessary that other has an OnTriggerEnter function declared   
            if(this.object.OnTriggerEnter && this.object.OnTriggerEnter(other))
            {
                this.object.OnTriggerEnter(other);
                this.trigger = false;
            }
        }
        
    }

//Debug mode to draw on screen all coliders based on their type
    DebugDraw(ctx)
    {
        if(this.active)
        {
            ctx.save();

            if(this.type == TYPE.DYNAMIC)
            {
                ctx.fillStyle = "rgba(255,0,0,0.5)"; 
            }
            else
            {
                ctx.fillStyle = "rgba(0,0,255,0.5)";
            }
            
            ctx.fillText("collider" + this.name, this.position_x, this.position_y);
            ctx.fillRect(this.position_x, this.position_y, this.width, this.height);

            ctx.restore();
        }
        
    }

}