function checkInput(char, asteroidArray){
    //Check if key is pressed down and not empty
    //Checks for backspace (keycode 8 is backspace). If detected, pop last character from string stack
    //console.log(key)
    if(char == "Backspace"){
        stringStack.pop();
        console.log(stringStack);
    } else {
        //Else, check if keyCode is not empty and push new car to string stack
        
        stringStack.push(char);
        asteroidArray.forEach( (asteroid) => {
            //If the string stack contains letters matching asteroid code, set asteroid to point
            if(asteroid.code.includes(stringStack.join(""))){
                asteroidToPoint = asteroid.id;
            }
        })
    }
    if(stringStack.length <= 0){
        asteroidToPoint = -1;
        return asteroidArray;
    }
    return checkToDelete(asteroidArray);
    
    
}

//Checking if its safe to delete asteroid from active asteroid array.
//First check if stack is in asteroid code, then delete if it has correct contents and length.
function checkToDelete(asteroidArray){
    let code = stringStack.join("");
    let tempAsteroidArr= [];
    asteroidArray.forEach( (asteroid) => {
        if(asteroid.code.includes(code) ){
            tempAsteroidArr.push(asteroid)
        }
    })
    if(tempAsteroidArr.length  === 1){
        if(tempAsteroidArr[0].code.length === stringStack.length){
            let asteroidToExplodeCoords = [tempAsteroidArr[0].position.x, tempAsteroidArr[0].position.y];
            if(projectileArray.length <= 0){
                fireProjectile(asteroidToExplodeCoords);
            }
        }
    }
    return asteroidArray;
}



