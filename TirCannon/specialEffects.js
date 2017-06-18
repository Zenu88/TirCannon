
//gestion des côtés

function containSprite(sprite) {
    if ((sprite.y + sprite.height / 2) > ground.y) {
        sprite.vy = -0.5 * sprite.vy;
        sprite.y = ground.y - sprite.height / 2;
    }

    if ((sprite.x - sprite.width / 2) < leftWall.x + blockLength) {
        sprite.vx = -0.5 * sprite.vx;
        sprite.x = sprite.width / 2 + leftWall.x + blockLength;
    }

    if ((sprite.x + sprite.width / 2) > rightWall.x) {
        sprite.vx = -0.5 * sprite.vx;
        sprite.x = rightWall.x - sprite.width / 2;
    }
    if ((sprite.y - sprite.height / 2) < roofWall.y + blockLength) {
        sprite.vy = -0.5 * sprite.vy;
        sprite.y = sprite.height / 2 + roofWall.y + blockLength;
    }
}

//explosions

function explosionParticles(explodingSprite,gameScene) {
    var particles = [];
    for (i = 0; i < 100; i++) {


        var particle = explodingSprite.clone();
        particle.scale.set(0.5 * Math.random());
        particle.position.set(500 + Math.random() * 20, 500 + Math.random() * 20);
        particle.vx = -20 + 40 * Math.random();
        particle.vy = -20 + 40 * Math.random();
        particle.visible = true;
        particles.push(particle);
        gameScene.addChild(particle);

        //return particles;

    }

    explodingSprite.visible = false;
    return particles;
}

function explodingParticles(particles) {
    particles.forEach(function (particle) {

        if (particle.width >= 0) {
            containSprite(particle);
            particle.width -= 0.5;
            particle.height -= 0.5;
            moveSprite(particle);
        }
        else {
            particle.visible = false;
        }


    });
}

