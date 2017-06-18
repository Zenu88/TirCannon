$.getScript("specialEffects.js", function () {

    $(function () {



        var renderer = PIXI.autoDetectRenderer(1200, 800);
        renderer.backgroundColor = 0xFFE4B5;
        $('.PixiPage').append(renderer.view);

        var stage = new PIXI.Container();
        //stage.scale.set(0.5, 0.5);


        //scenes

        var introScene = new PIXI.Container();
        introScene.visible = true;
        stage.addChild(introScene);
        var inIntro = true;

        var gameScene = new PIXI.Container();
        gameScene.visible = false;
        stage.addChild(gameScene);

        var defeatScene = new PIXI.Container();
        defeatScene.visible = false;
        stage.addChild(defeatScene);

        var victoryScene = new PIXI.Container();
        victoryScene.visible = false;
        stage.addChild(victoryScene);

        var state = intro;


        //camera

        var camera = { x: 0, y: 0, vx: 0, vy: 0 };
        var cameraLatency = 5;


        //keyboard and mouse

        var leftKb = 37,
            upKb = 38,
            rightKb = 39,
            downKb = 40,
            spacebarKb = 32,
            enterKb = 13,
            upIsDown = false,
            downIsDown = false,
            rightIsDown = false,
            leftIsDown = false;


        $(document).keydown(function (e) {
            if (e.keyCode == rightKb) {
                rightIsDown = true;
            }
            if (e.keyCode == leftKb) {
                leftIsDown = true;
            }
            if ((e.keyCode == spacebarKb) || (e.keyCode == upKb)) {
                upIsDown = true;
            }
            if (e.keyCode == downKb) {
                downIsDown = true;
            }
            if (e.keyCode == enterKb) {
                if (inIntro) {
                    beginGame();
                    inIntro = false;
                }
            }

        });

        $(document).keyup(function (e) {
            if (e.keyCode == rightKb) {
                rightIsDown = false;
            }
            if (e.keyCode == leftKb) {
                leftIsDown = false;
            }
            if ((e.keyCode == spacebarKb) || (e.keyCode == upKb)) {
                upIsDown = false;
            }
            if (e.keyCode == downKb) {
                downIsDown = false;
            }
        });

        //playerSprite


        var hpMax = 50;
        var healthPool = hpMax;

        spriteTypes = ['A', 'B', 'C'];
        var colorA = '0xFF3300';
        var colorB = '0x9966FF';
        var colorC = '0x006400';


        var playerSprite = new PIXI.Graphics();
        playerSprite.beginFill(colorA);
        playerSprite.drawCircle(0, 0, 32);
        playerSprite.endFill();
        playerSprite.x = 64;
        playerSprite.y = 536 + 32;
        playerSprite.vx = 0;
        playerSprite.vy = 0;
        playerSprite.ax = 0;
        playerSprite.ay = 0;
        playerSprite.type = 'A';

        gameScene.addChild(playerSprite);

        //explosion

        var allExplosionParticles = [];


        function triggerExplosion(explodingSprite) {
            var particles = explosionParticles(explodingSprite);
            allExplosionParticles = allExplosionParticles.concat(particles);
        }


        function explosionsHandler() {
            explodingParticles(allExplosionParticles);
        }

        function explosionParticles(explodingSprite) {
            var particles = [];
            for (i = 0; i < 100; i++) {


                var particle = explodingSprite.clone();
                particle.position.set(explodingSprite.x, explodingSprite.y);
                particle.scale.set(0.5 * Math.random());

                particle.vx = -20 + 40 * Math.random();
                particle.vy = -20 + 40 * Math.random();
                particle.visible = true;
                particles.push(particle);
                gameScene.addChild(particle);
            }
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
                    particles.splice(particles.indexOf(particle), 1);
                }


            });
        }

        




        //ground walls roof
        var blockLength = 64
        var groundLength = 50;
        var ground = new PIXI.Container();
        for (i = 0; i < groundLength; i++) {

            var groundBlock = new PIXI.Graphics();
            groundBlock.lineStyle(4, 0xFF3300, 1);
            groundBlock.beginFill(0x66CCFF);
            groundBlock.drawRect(0, 0, 64, 64);
            groundBlock.endFill();
            groundBlock.x = i * 64;
            groundBlock.y = 0;
            ground.addChild(groundBlock);
        }
        ground.x = 0;
        ground.y = 800;
        gameScene.addChild(ground);

        var wallHeight = 50;
        var leftWall = new PIXI.Container();
        for (i = 0; i < wallHeight; i++) {

            var groundBlock = new PIXI.Graphics();
            groundBlock.lineStyle(4, 0xFF3300, 1);
            groundBlock.beginFill(0x66CCFF);
            groundBlock.drawRect(0, 0, 64, 64);
            groundBlock.endFill();
            groundBlock.x = 0;
            groundBlock.y = ground.y - i * 64;
            leftWall.addChild(groundBlock);
        }
        leftWall.x = 0;
        leftWall.y = 0
        gameScene.addChild(leftWall);

        var rightWall = new PIXI.Container();
        for (i = 0; i < wallHeight; i++) {

            var groundBlock = new PIXI.Graphics();
            groundBlock.lineStyle(4, 0xFF3300, 1);
            groundBlock.beginFill(0x66CCFF);
            groundBlock.drawRect(0, 0, 64, 64);
            groundBlock.endFill();
            groundBlock.x = 0;
            groundBlock.y = ground.y - i * 64;
            rightWall.addChild(groundBlock);
        }
        rightWall.x = (groundLength - 1) * 64;
        rightWall.y = 0
        gameScene.addChild(rightWall);

        var roofWall = new PIXI.Container();
        for (i = 0; i < groundLength; i++) {

            var groundBlock = new PIXI.Graphics();
            groundBlock.lineStyle(4, 0xFF3300, 1);
            groundBlock.beginFill(0x66CCFF);
            groundBlock.drawRect(0, 0, 64, 64);
            groundBlock.endFill();
            groundBlock.x = i * 64;
            groundBlock.y = 0;
            roofWall.addChild(groundBlock);
        }
        roofWall.y = ground.y - (wallHeight - 1) * 64;
        gameScene.addChild(roofWall);


        //state : play()


        function play() {
            //explodingParticles(explosion2);
            explosionsHandler();
            //explode(playerSprite, renderer);
            scoreDisplayer();
            healthDisplayer();
            createTarget();
            moveTargets();
            movePlayerSprite();
            moveCamera();
            detectCollision();
            winCondition();
            defeatCondition();
        }

        //déplacement sprite

        var coeffFriction = -0.01;
        var virtualGravity = 0;


        function moveSprite(sprite) {
            sprite.x += sprite.vx;
            sprite.y += sprite.vy;
        }

        function movePlayerSprite() {
            containSprite(playerSprite);

            // Friction frottement
            var spriteFriction = playerSprite.vx * coeffFriction;
            var spriteFrottement = playerSprite.vy * coeffFriction;

            if (rightIsDown) {
                playerSprite.ax = 1;
            }
            else if (leftIsDown) {
                playerSprite.ax = -1;
            }
            else {
                playerSprite.ax = 0;
            }


            if (upIsDown) {
                playerSprite.ay = -1;

            }
            else if (downIsDown) {
                playerSprite.ay = 1;
            }
            else {
                playerSprite.ay = 0;
            }

            playerSprite.vx += playerSprite.ax + spriteFriction;
            playerSprite.x += playerSprite.vx;

            playerSprite.vy += playerSprite.ay + spriteFrottement + virtualGravity;
            playerSprite.y += playerSprite.vy;

            //playerSprite.ay = 0; // reset de l'acceleration verticale

        }

        //déplacement camera

        function moveCamera() {
            var hdx = (playerSprite.x - camera.x) / cameraLatency;
            var hdy = (playerSprite.y - camera.y) / cameraLatency;
            camera.x += hdx;
            camera.y += hdy;
            gameScene.position.set(-camera.x + 500, -camera.y + 400);
        }

        //saut

        function playerJump() {
            playerSprite.ay += -4;
        }

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

        //sprite cibles

        var targetTimeToken = 0;
        var targetBalls = [];

        function createTarget() {

            if (targetTimeToken % 7 == 0) {
                var targetBall = new PIXI.Graphics();
                targetBall.type = spriteTypes[targetTimeToken % 3];
                if (targetBall.type == 'A') {
                    targetBall.beginFill(colorA);
                }
                else if (targetBall.type == 'B') {
                    targetBall.beginFill(colorB);
                }
                else if (targetBall.type == 'C') {
                    targetBall.beginFill(colorC);
                }

                targetBall.drawCircle(0, 0, 32);
                targetBall.endFill();
                targetBall.x = Math.random() * (rightWall.x - leftWall.x) + leftWall.x;
                targetBall.y = Math.random() * (ground.y - roofWall.y) + roofWall.y;
                targetBall.vx = Math.random() * 3;
                targetBall.vy = Math.random() * 3;
                targetBall.ax = 0;
                targetBall.ay = 0;
                targetBall.visible = true;


                targetBalls.push(targetBall);

                gameScene.addChild(targetBall);
            }
            targetTimeToken++;
        }


        function moveTargets() {
            targetBalls.forEach(function (targetBall) {
                containSprite(targetBall);

                targetBall.x += targetBall.vx;
                targetBall.y += targetBall.vy;
                //if (targetBalls.y > ground.y) {
                //    targetBall.visible = false;
                //}
                //console.log('target removed');
            });
        }

        // score

        var score = 0;
        var scoreMax = 20;

        scoreDisplay = new PIXI.Text(
            "",
            { font: "32px Futura", fill: "white" }
        );


        function scoreDisplayer() {
            scoreDisplay.text = "Score : " + score;
            //scoreDisplay.position.set(-gameScene.x + 500, -gameScene.y + 600);
            scoreDisplay.position.x = 500;
            scoreDisplay.position.y = 700;
            stage.addChild(scoreDisplay);
        }

        //health


        var healthBarLength = 120;

        var healthBar = new PIXI.DisplayObjectContainer();
        healthBar.position.set(-gameScene.x + 500, -gameScene.y + 700)
        gameScene.addChild(healthBar);

        var innerBar = new PIXI.Graphics();
        innerBar.beginFill(colorB);
        innerBar.drawRect(0, 0, healthBarLength, 10);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        var outerBar = new PIXI.Graphics();
        outerBar.beginFill(colorA);
        outerBar.drawRect(0, 0, healthBarLength, 10);
        outerBar.endFill();
        healthBar.addChild(outerBar);

        healthBar.outer = outerBar;

        function healthDisplayer() {
            healthBar.outer.width = healthBarLength * healthPool / hpMax;
            healthBar.position.set(-gameScene.x + 500, -gameScene.y + 650)
        }


        // detect collision

        function detectCollision() {
            targetBalls.forEach(function (targetBall) {
                if (targetBall.visible == true) {
                    if (Math.sqrt((targetBall.x - playerSprite.x) * (targetBall.x - playerSprite.x) + (targetBall.y - playerSprite.y) * (targetBall.y - playerSprite.y)) < (playerSprite.width + targetBall.width) / 2) {
                        handleCollision(targetBall);
                        triggerExplosion(targetBall);
                        targetBall.visible = false;

                    }
                }
            });
        }

        function handleCollision(targetBall) {
            if (playerSprite.type == targetBall.type) {
                score++;

            }
            else {
                if (targetBall.type == 'B') {
                    healthPool--;
                }
                else if (targetBall.type == 'C') {
                    if (score > 0) {
                        score--;
                    }
                }
            }
        }

        //intro scene

        function intro() {

        }

        introMessage = new PIXI.Text(
            "Catch some food !",
            { font: "32px Futura", fill: "white" }
        );
        introMessage.position.set(500, 200);
        introScene.addChild(introMessage);

        function beginGame() {
            state = play;
            introScene.visible = false;
            gameScene.visible = true
        }

        //win condition

        victoryMessage = new PIXI.Text(
            "You Won !",
            { font: "32px Futura", fill: "white" }
        );
        victoryMessage.position.set(500, 200);
        victoryScene.addChild(victoryMessage);


        function winCondition() {
            if (score >= scoreMax) {
                state = victory;
            }
        }

        function victory() {
            gameScene.visible = false;
            victoryScene.visible = true;
        }

        //defeat condition 

        defeatMessage = new PIXI.Text(
            "You Lost ! Noob (newbie) !",
            { font: "32px Futura", fill: "red" }
        );
        defeatMessage.position.set(500, 200);
        defeatScene.addChild(defeatMessage);

        function defeatCondition() {
            if (healthPool <= 0) {
                state = defeat;
            }
        }

        function defeat() {
            gameScene.visible = false;
            defeatScene.visible = true;
        }

        //gameLoop

        function gameLoop() {
            requestAnimationFrame(gameLoop);
            state();
            renderer.render(stage);
        }

        gameLoop();

    });

});