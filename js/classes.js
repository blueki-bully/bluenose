class Sprite {
    constructor({ 
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = { x: 0, y: 0 }  
    }) {
        this.position = position;
        this.width = 50; // Assuming default width
        this.height = 150; // Assuming default height
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10; // Adjust as needed for frame rate
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
   
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
        this.velocity = velocity;
        this.color = color;
        this.lastKey = '';
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.isAttacking = false;
        this.isTakingHit = false;
        this.isDead = false;
        this.health = 100;
        this.sprites = sprites;

        // Load sprite images
        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }
    }

    update() {
        // Handle animation based on velocity and state
        if (this.isDead) {
            this.switchSprite('death');
        } else if (this.isTakingHit) {
            this.switchSprite('takeHit');
        } else if (this.isAttacking) {
            this.switchSprite('attack1');
        } else if (this.velocity.y < 0) {
            this.switchSprite('jump');
        } else if (this.velocity.y > 0) {
            this.switchSprite('fall');
        } else if (this.velocity.x === 0) {
            this.switchSprite('idle');
        } else {
            this.switchSprite('run');
        }

        this.draw();
        this.animateFrames();


        if (!this.isDead) {
            // Update position and handle gravity
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Gravity
            if (this.position.y + this.height + this.velocity.y >= canvas.height - 56) {
                this.velocity.y = 0;
                this.position.y = canvas.height - this.height - 56; // Adjust based on canvas height
            } else {
                this.velocity.y += gravity;
            }
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit(){
        this.health -= 10;
        
        if (this.health <= 0) {
            this.switchSprite('death');
            this.isDead = true;
        } else {
            this.isTakingHit = true;
            this.switchSprite('takeHit');

            // Reset isTakingHit after animation completes
            setTimeout(() => {
                this.isTakingHit = false;
            }, this.framesMax * this.framesHold * 1000 / 200); // Assuming 60fps
        }
    }

    switchSprite(sprite) {
        // If dead, override other animations
        if (this.isDead && this.image === this.sprites.death.image && this.framesCurrent < this.sprites.death.framesMax - 1) {
            return;
        }

        // If taking hit or attacking, don't override these animations
        if (this.isTakingHit && this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) {
            return;
        }

        if (this.isAttacking && this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) {
            return;
        }

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}
