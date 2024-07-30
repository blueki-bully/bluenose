const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect (0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './images/map.png'
})

const shop = new Sprite({
    position: {
        x: 695,
        y: 167.5
    },
    imageSrc: './images/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './images/guts/Idle.png',
    framesMax: 10, // This is for the idle animation initially
    scale: 2.5,
    offset: {
        x: 100,
        y: 55
    },
    sprites: {
        idle: {
            imageSrc: './images/guts/Idle.png',
            framesMax: 10 // Number of frames in idle animation
        },
        run: {
            imageSrc: './images/guts/Run.png',
            framesMax: 8 // Number of frames in run animation
        },
        jump: {
            imageSrc: './images/guts/Going Up.png',
            framesMax: 3 // Number of frames in run animation
        },
        fall: {
            imageSrc: './images/guts/Going Down.png',
            framesMax: 3 // Number of frames in run animation
        },
        attack1: {
            imageSrc: './images/guts/Attack2.png',
            framesMax: 6 // Number of frames in run animation
        },
        takeHit: {
            imageSrc: './images/guts/Take Hit.png',
            framesMax: 3 // Number of frames in run animation
        },
        death: {
            imageSrc: './images/guts/Death.png',
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x:100,
            y:50
        },
        width: 115,
        height: 50
    }
});


const enemy = new Fighter ({
    position: {
    x: 950,
    y: 100
 },
velocity: {
    x: 0,
    y: 0
 },
 color: 'red',
 offset: {
    x: 0,
    y: 0
 },
 imageSrc: './images/Musashi/Idle.png',
    framesMax: 10, // This is for the idle animation initially
    scale: 2.5,
    offset: {
        x: 150,
        y: 65
    },
    sprites: {
        idle: {
            imageSrc: './images/Musashi/Idle.png',
            framesMax: 10 // Number of frames in idle animation
        },
        run: {
            imageSrc: './images/Musashi/Run.png',
            framesMax: 6 // Number of frames in run animation
        },
        jump: {
            imageSrc: './images/Musashi/Jump.png',
            framesMax: 2 // Number of frames in run animation
        },
        fall: {
            imageSrc: './images/Musashi/Fall.png',
            framesMax: 2 // Number of frames in run animation
        },
        attack1: {
            imageSrc: './images/Musashi/Attack2.png',
            framesMax: 4 // Number of frames in run animation
        },
        takeHit: {
        imageSrc: './images/Musashi/Get Hit.png',
        framesMax: 3
    },
    death: {
        imageSrc: './images/Musashi/Death.png',
        framesMax: 9
    }
},
    attackBox: {
        offset: {
            x:-120,
            y:50    
        },
        width: 120,
        height: 50
    }
})

enemy.draw()

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

        //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -3
            enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 3
            enemy.switchSprite('run')
    } else {
            enemy.switchSprite('idle')
    }
            //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (player.velocity.y > 0){
        enemy.switchSprite('fall')
    }


        //detect Collision & enemy get hit
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: enemy
            })&&
            player.isAttacking && 
            player.framesCurrent === 3
        ) {
            enemy.takeHit()
            player.isAttacking = false

            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })
        }
        //if player misses
        if(player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false
        }
        
        //this is where player gets hit
        if (
            rectangularCollision({
                rectangle1: enemy,
                rectangle2: player
            })&&
            enemy.isAttacking && enemy.framesCurrent === 2
        ){
            player.takeHit()
            enemy.isAttacking = false
            gsap.to('#playerHealth', {
            width: player.health + '%'
            })
        }
                //if enemy misses
        if(enemy.isAttacking && enemy.framesCurrent === 2){
            enemy.isAttacking = false
        }

        //end game based on health
        if (enemy.health <= 0 || player.health <= 0){
        determineWinner({ player, enemy, timerId })
        }

}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.isDead) {


    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true 
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }
}
    if (!enemy.isDead){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true 
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
}
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowDown':
                enemy.isAttacking = false
                break
    }
})