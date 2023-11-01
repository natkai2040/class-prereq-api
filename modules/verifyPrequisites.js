export function verifyPrereqExpression(symExp, prereqList){
    switch (symExp[0]) {
        case("AND"): {
            return compareAnd(symExp, prereqList); 
        }
        case("OR"): { // check for one true, otherwise false; 
            return compareOr(symExp, prereqList);  
        }
        default: { // Incorrect Format
            return null; 
        }
    }
}

function compareAnd(symExp, prereqList){
    let atom; 
    if (symExp.length <= 1){ // for edge case ["AND", ]
        return false;
    }
    for(let i = 1; i<symExp.length; ++i){
        atom = (Array.isArray(symExp[i]))? verifyPrereqExpression(symExp[i], prereqList):prereqList.includes(symExp[i]);
        if (atom == false){ // SHORT CIRCUIT EVAL
            return false; 
        }
    }
    return true; 
}

function compareOr(symExp, prereqList){
    let atom; 
    for(let i = 1; i<symExp.length; ++i){
        atom = (Array.isArray(symExp[i]))? verifyPrereqExpression(symExp[i], prereqList):prereqList.includes(symExp[i]);
        if (atom == true){
            return true; 
        }
    }
    return false
}


export function getPrereqExpressionVariables(symExp){
    let variables = []
    switch (symExp[0]) {
        case("AND"): {}
        case("OR"): { 
            for(let i = 1; i<symExp.length; ++i){
                if (Array.isArray(symExp[i])){
                    variables = variables.concat(getPrereqExpressionVariables(symExp[i])); 
                } else {
                    variables.push(symExp[i]); 
                }
            }
            break; 
        }
        default: { // Incorrect Format
            return null; 
        }
    }
    return [...new Set(variables)]; 
}


// let cs589 = ["AND", 
//                 ["OR", 
//                     "MATH|545", 
//                     ["AND", 
//                         "MATH|235", 
//                         "MATH|233"
//                     ]
//                 ],
//                 ["OR", 
//                     "STATISTC|515",
//                     "COMPSCI|240"
//                 ],
//                 "COMPSCI|240"
//             ]; 