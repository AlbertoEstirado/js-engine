

var canvas = null;
var ctx = null;


var currentFramesCounter = 0;
var lastFramesCounter = 0;
var targetDT = 1/30;
var acumDelta = 0;
var time = 0;
var lastTimeUpdate = 0;
var deltaTime = 0;


window.onload = BodyLoaded;

function BodyLoaded()
{
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    SetupKeyboardEvents();
    SetupMouseEvents();

    game.Start();

    Loop();

}

function Loop()
{
    window.requestAnimationFrame(Loop);

    let now = Date.now();

    deltaTime = (now - time) / 1000;

    if (deltaTime > 1)
        deltaTime = 0;

    time = now;

    lastTimeUpdate = now;

    currentFramesCounter++;
    acumDelta += deltaTime;

    if (acumDelta >= 1)
    {
        lastFramesCounter = currentFramesCounter;
        currentFramesCounter = 0;
        acumDelta = acumDelta - 1;
    }
    
    if (lastPress == KEY_PAUSE || lastPress == KEY_ESCAPE)
    {
        pause = !pause;
        lastPress = -1;
    }


    game.Update(deltaTime);

    Draw(ctx);
}

function Draw(ctx)
{
    game.Draw(ctx);

    /*
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS"
    ctx.fillText("frames=" + currentFramesCounter, 330, 20);
    ctx.fillText("deltaTime=" + deltaTime.toFixed(4), 330, 36);
    ctx.fillText("current FPS=" + (1 / deltaTime).toFixed(2), 330, 52);
    ctx.fillText("last second FPS=" + lastFramesCounter, 330, 68);
    */
    //DrawWorldDebug(ctx);

}

