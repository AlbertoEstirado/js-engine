var audio_shoot = null;
var audio_enemyShoot= null;
var audio_explosion= null;
var audio_bossEntering= null;
var audio_bossShoot= null;
var audio_collision= null;
var audio_song= null;

var audioManager = 
{   
    LoadSounds()
    {
        audio_shoot = document.getElementById("shoot");
        audio_enemyShoot = document.getElementById("enemyShoot");
        audio_explosion = document.getElementById("explosion");
        audio_bossEntering = document.getElementById("bossEntering");
        audio_bossShoot = document.getElementById("bossShoot");
        audio_collision = document.getElementById("collision");
        audio_song = document.getElementById("song");
    }
}

