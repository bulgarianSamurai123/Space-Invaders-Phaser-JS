'use strict'
const game = new Phaser.Game(1800, 900, Phaser.AUTO,'game-canvas', { preload, create, update })

// Assets \\
let bg
let player
var bullet
var enemy

// Groups \\
var bullets
var enemies

// Text \\
let helpText
let scoreText
let winText
let gameOverText
let time

// Keys \\
let leftKey
let rightKey
let aKey
let dKey
let spaceBar

// Text Syles \\
let textStyle = { font: 'Arial Black', fontSize:  17, fill: '#b8b8b8' }
let scoreStyle = { font: 'Arial Black', fontSize: 19, fill: '#ffffff'}
let winStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}
let gameOverStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}
let timeStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}

// Parametres \\
    // Float and Int
    let movementSpd = 5
    let bulletTime = 0
    let points = 0
    let sec = 0
    let min = 0
    let counter = 0

    // Bool
    let CanMove = true
    let GameOver = false
    let Win = false
//------------\\

// Other \\
var enemyTween


function preload() 
{
    game.load.image("bg", "Images/Star Wars Stars Background.jpg") // Loading Background
    game.load.image("plr", "Images/space-ship/blue.png") // Loading Player
    game.load.image("enemy", "Images/space-ship/black.png") // Loading Enemy
    game.load.image("bullet", "Images/Projectiles/bullet0.png") // Loading Projectile
}

function create() 
{
    // Adding Background
    bg = game.add.image(0, 0, "bg")
    bg.scale.setTo(.95, .9)
    
    // Adding Player
    AddingPlayer() 


    /* -- Bullet Group -- */
        BulletGroup()
    /* ------------------ */
    
    /* -- Enemy Group Create and Make -- */
        EnemyGroup()
        CreateEnemies()
    /* --------------------------------- */

    /* ----- Other ----- */
        // Creating Keyboard Inputs
        KeyInputs()

        // Creating Text
        CreateText()
    /* ----------------- */
}

function update() 
{
    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this)

    if (CanMove)
    {
        // Press Left Arrow Key or W Key to move
        if (leftKey.isDown || aKey.isDown)
        {  player.y -= movementSpd  }

        // Press Right Arrow Key or D Key to move
        else if (rightKey.isDown || dKey.isDown)
        {  player.y += movementSpd;  }

        // Press Space to FireBullet()
        if (spaceBar.isDown) 
        {  FireBullet()  }
    }

    getTime()

    if (!GameOver)
    {  WinTextPopUP()  }
    else if (GameOver && !Win)
    {  GameOverTextPopUP()  }

}

// Adding Player Function \\
function AddingPlayer()
{
    player = game.add.sprite(100, 200, "plr")
    player.scale.setTo(.08, .08)
    player.anchor.setTo(.5, .5)
    player.angle = 90
    game.physics.enable(player, Phaser.Physics.ARCADE)
}


/* [!] Creating Bullet Group and Fireing function [!] */

    // Creating Bullet Group \\
    function BulletGroup()
    {
        bullets = game.add.group()
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE
        bullets.createMultiple(30, "bullet")

        bullets.setAll("anchor.x", .5)
        bullets.setAll("anchor.y", .5)
        
        bullets.setAll("angle", 90)
        
        bullets.setAll("outOfBoundsKill", true)
        bullets.setAll("checkWorldBounds", true)    
    }

    // Creating Firing Bullets function \\
    function FireBullet()
    {
        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false)

            if (bullet)
            {
                bullet.reset(player.x + 30, player.y)
                bullet.body.velocity.x = 700
                bulletTime = game.time.now + 200
            }
        }
    }

/* [!] ------------------------------------------[!] */


/* [!] Enemy Creating Group and Creating Enemies [!] */

    // Creating Enemy Group \\
    function EnemyGroup()
    {
        enemies = game.add.group()
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE
    }

    // Creating Enemies \\
    function CreateEnemies()
    {
        for (var y = 0; y < 5; y++)
        {
            for (var x = 0; x < 3; x++)
            {
                enemy = enemies.create(x * 80, y * 130, "enemy")
                enemy.anchor.setTo(.5)
                enemy.scale.setTo(.08)
                enemy.angle = 270
            }

            enemies.x = 1550
            enemies.y = 140

            enemyTween = game.add.tween(enemies). to({y: 290}, 1500, 
                Phaser.Easing.Linear.None, true, 0, 1000, true)
        }
    }

/* [!] ------------------------------------------[!] */


/* [!] ------ Other ------- [!] */

    // Creating Key Inputs \\
    function KeyInputs()
    {
        // 🡢, 🡠, 🡣, 🡡
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)

        // A, W, S, D
        aKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D)

        // Space
        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }

    // Creating Texts \\
    function CreateText()
    {
        helpText = game.add.text(10, 10, 
            "Press A Key / Right Arrow Key to move Up \nPress D Key / Left Arrow Key to move Down \nPress Spacebar to shoot", 
            textStyle)
        scoreText = game.add.text(1500, 40, "Score : ", scoreStyle)
        time = game.add.text(740, 40, "Time : ", timeStyle)
        winText = game.add.text(game.world.centerX, game.world.centerY, 
            "You Win!", winStyle)
        gameOverText = game.add.text(game.world.centerX, game.world.centerY,
            "Game Over!", gameOverStyle)
        
        winText.visible = false
        gameOverText.visible = false

        winText.anchor.setTo(.5)
        gameOverText.anchor.setTo(.5)
    }

    // Win Text PopUP
    function WinTextPopUP()
    {
        scoreText.text = "Score : " + points
        
        if (points == 1500 && !Win)
        {
            CanMove = false 
            winText.visible = true
            scoreText.visible = false
            Win = true
        }
    }

    // Game Over PoPUP
    function GameOverTextPopUP()
    {
        if (GameOver)
        {
            CanMove = false
            winText.visible = false
            scoreText.visible = false
            gameOverText.visible = true
        }
    }

    function getTime() 
    {
        if (!Win)
        {
            counter++
        }

        sec = Math.round(counter / 60)

        if (!Win) 
        {
            if (sec > 10)
            {
                GameOver = true
                counter = 0
                CanMove = false
            }
        }


        if (!GameOver)
        {
            if (sec > 60)  
            { sec = 0; counter = 0;  min++ }

            let timer = ''

            if (min < 10) 
            { timer += '0' + min } 
            else 
            { timer += min }

            timer += ':'

            if (sec < 10) 
            { timer += '0' + sec } 
            else 
            { timer += sec }

            time.setText('Timer: ' + timer) 
        }
        else { time.setText('Timer: 00:00') }
    }

    // Collision Handler \\
    function collisionHandler(bullet, enemy)
    {   
        bullet.kill()
        enemy.kill()

        points += 100
    }

/* [!] --------------------- [!] */
