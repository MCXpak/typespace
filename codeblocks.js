function checkInput(char, asteroidArray){
    let currentAstPointAt = asteroidToPoint;
    if(char == "Backspace"){
        stringStack.pop();
        console.log(stringStack);
    } else {
        stringStack.push(char);
        asteroidArray.forEach( (asteroid, index) => {
            //console.log(asteroid.code.substr(0,stringStack.length))
            if(asteroid.code.substr(0,stringStack.length) === stringStack.join("")){
                asteroidToPoint = asteroid.id;
                asteroidToPointIndex = index
                if(currentAstPointAt !== asteroid.id){
                    ship.rotateTo(-shipRotationCalc(),3000);
                    rotateThrusters(-shipRotationCalc());
                }
                let asteroidToExplodeCoords = [asteroid.x, asteroid.y]
                console.log(`Diff: ${asteroid.maxHealth - asteroid.health}, Len: ${stringStack.length}`)
                if(asteroid.maxHealth - asteroid.pseudoHealth < stringStack.length){
                    asteroid.pseudoHealth -= 1;
                    fireProjectile(asteroidToExplodeCoords, asteroidToPoint);
                }
                if(asteroid.pseudoHealth === 0){
                    stringStack = [];
                }
                
            }
        })
    }
    if(stringStack.length <= 0){
        asteroidToPoint = -1;
    }
}

//Check all asteroids
//If first character is a match, only check this asteroid
//Continue to check asteroid until it is destroyed
//Reset
