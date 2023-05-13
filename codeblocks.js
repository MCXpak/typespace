function checkInput(char, asteroidArray){
    let currentAstPointAt = asteroidToPoint;
    if(char == "Backspace"){
        stringStack.pop();
        console.log(stringStack);
    } else {
        stringStack.push(char);
        asteroidArray.forEach( (asteroid, index) => {
            if(asteroid.code.includes(stringStack.join(""))){
                asteroidToPoint = asteroid.id;
                asteroidToPointIndex = index
                if(currentAstPointAt !== asteroid.id){
                    ship.rotateTo(-shipRotationCalc(),3)
                }
                let asteroidToExplodeCoords = [asteroid.x, asteroid.y]
                fireProjectile(asteroidToExplodeCoords);
            }
        })
    }
    if(stringStack.length <= 0){
        asteroidToPoint = -1;
    }
}

