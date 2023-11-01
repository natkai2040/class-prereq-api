import assert from 'node:assert/strict';

// CREATE: 
// 	POST: class to the tree
// 		○ Route: /courses
// 		○ Request: { course }
// 		○ Response: { course }
console.log("Reset Tests by Deleting CS|1000, CS|999")
let res1 = await fetch('http://localhost:3000/courses/COMPSCI|999', {
    method: 'DELETE',
    }).then((res) => {return res.json()}); 
res1 = await fetch('http://localhost:3000/courses/COMPSCI|1000', {
    method: 'DELETE',
    }).then((res) => {return res.json()}); 


console.log("1.\nPOST CS|999");
res1 = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|999",
            "subjectLong": "Computer Science",
            "subjectShort": "CompSci",
            "subjectId": "COMPSCI",
            "number": "999",
            "topic": null,
            "displayTitle": "999 Foo Bar Baz",
            "title": "Foo Bar Baz",
            "titleLong": "Computer Science 999 - Foo Bar Baz",
            "description": null,
            "hasTopics": false,
            "corequisites": null,
            "prerequisites": null,
            "hasRestrictions": false
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.id, "COMPSCI|999");

console.log("POST CS|999 Duplicate Error")
res1 = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|999",
            "subjectLong": "Computer Science",
            "subjectShort": "CompSci",
            "subjectId": "COMPSCI",
            "number": "999",
            "topic": null,
            "displayTitle": "999 Foo Bar Baz",
            "title": "Foo Bar Baz",
            "titleLong": "Computer Science 999 - Foo Bar Baz",
            "description": null,
            "hasTopics": false,
            "corequisites": null,
            "prerequisites": null,
            "hasRestrictions": false
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.error, "Course has duplicate ID");

console.log("POST CS|999 Incorrect Body Error")
res1 = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000",
            "XXXXXXXXXX": "Computer Science", // ERROR
            "subjectShort": "CompSci",
            "subjectId": "COMPSCI",
            "number": "999",
            "topic": null,
            "displayTitle": "999 Foo Bar Baz",
            "title": "Foo Bar Baz",
            "titleLong": "Computer Science 999 - Foo Bar Baz",
            "description": null,
            "hasTopics": false,
            "corequisites": null,
            "prerequisites": null,
            "hasRestrictions": false
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.error, "Course body does not follow convention");

// READ: 
// 	GET: Course Given IDs, Reprsented as JSON
// 		○ Route: courses/:id
// 		○ Response: HTML
console.log("2.\nGET COMPSCI|999 by ID")
res1 = await fetch('http://localhost:3000/courses/json/COMPSCI%7C999', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.id, "COMPSCI|999")

console.log("GET COMPSCI|000 by ID Error")

res1 = await fetch('http://localhost:3000/courses/json/COMPSCI%7C000', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.error, "Course not found")

// 	GET: All Courses, Represented as a JSON
// 		○ Route: /courses/json
// 		○ Response: HTML

// TEST: FETCH, AND THEN TEST THAT A COURSE IS ADDED. 
console.log("3.\nGET All Courses")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(Array.isArray(res1), true); 

let initial_length = res1.length; 

console.log("(POST CS|1000)")
res1 = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000",
            "subjectLong": "Computer Science", // ERROR
            "subjectShort": "CompSci",
            "subjectId": "COMPSCI",
            "number": "1000",
            "topic": null,
            "displayTitle": "CS 1000",
            "title": "CS 1000",
            "titleLong": "Computer Science 1000 - Foo Bar Baz",
            "description": null,
            "hasTopics": false,
            "corequisites": null,
            "prerequisites": null,
            "hasRestrictions": false
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.id, "COMPSCI|1000");

console.log("GET All Courses: Length incremented")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(Array.isArray(res1), true); 
assert.strictEqual(res1.length == initial_length+1, true); 

// 	PATCH: Change Course Data. NOTE: Data Cannot Include "id"
// 		○ Route: courses/id="CS|111"
// 		○ Request: {"id":"", "course_data":{}}
// 		○ Response: { course }
console.log("4.\nPATCH CS|1000 to change subjectLong")
res1 = await fetch('http://localhost:3000/courses', {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000",
            "course_data": {"subjectLong": "Apple"},
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.subjectLong, "Apple");

console.log("PATCH CS|1000 incorrect key typing")
res1 = await fetch('http://localhost:3000/courses', {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000",
            "course_data": {"prerequisites": false},
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.error, "Course body does not follow convention");

// 	PATCH: Change Prerequisites 
// 		Route: courses/prerequisites
// 		Request: {"id":"", "prerequisites":{}}
// 		Response: { course }

console.log("5.\nPATCH CS|1000 Prerequisites to CS|999")
res1 = await fetch('http://localhost:3000/courses/prerequisites', {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000",
            "prerequisites": ["AND", "COMPSCI|999"]
        }),
    }).then((res) => {return res.json()});
assert.strictEqual(res1.prerequisites[1],"COMPSCI|999");

console.log("PATCH CS|1000 Prerequisites incorrect body")
res1 = await fetch('http://localhost:3000/courses/prerequisites', {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|1000"
        }),
    }).then((res) => {return res.json()}).catch((err) => console.log("PATCH CS|1000 error: "+ err));
assert.strictEqual(res1.error,'Malformed Request Body');

// 	GET: All Courses, represented as graphnodes
// 		○ Route: /courses/graphnodes
// 		○ Response: JSON

console.log("6.\nGET Graphnodes success")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(Array.isArray(res1), true); 

console.log("GET Graphnodes includes CS1000 and CS999")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(JSON.stringify(res1).indexOf("COMPSCI|999") > -1, true); 
// 	GET: All prerequisites, represented as graphedges
// 		○ Route: /courses/graphedges
// 		○ Response: JSON
console.log("7.\nGET Graphedges success")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(Array.isArray(res1), true); 

console.log("GET Graphedges includes link between CS1000 and CS999")
res1 = await fetch('http://localhost:3000/courses/json/', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(JSON.stringify(res1).indexOf("{\"from\":\"COMPSCI|999\",\"to\":\"COMPSCI|1000\",\"text\":\"\"}") > -1, true); 
// 	GET: All Courses, Represented as a Graph
// 		○ Route: /courses/graph
// 		○ Response: HTML

console.log("8.\nGET Graph Success")
res1 = await fetch('http://localhost:3000/courses/graph/', {
    method: 'GET',
    }).then((res) => {return res}).catch((err) => console.log("GET Graph error: "+ err));  
assert.strictEqual(res1.status, 200)

// 	GET: List of Possible courses given a set of courses, Represented as a JSON
// 		○ Route: courses/json/with_prerequisites/:id_list
// 			§ Route Parameter is List of CourseIds delimited by commas
// 			§ Example: /CS|111,CS|240
// 		○ Response: HTML
// UPDATE: 

console.log("9.\nGET Possible Courses: CS|1000 given");
res1 = await fetch('http://localhost:3000/courses/json/with_prerequisites/COMPSCI|999', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(Array.isArray(res1), true); 

console.log("GET Possible Courses: 589 TEST");
let cs589 = ["AND", ["OR", "MATH|545", 
["AND", "MATH|235", "MATH|233"]],["OR", "STATISTC|515","COMPSCI|240"],"COMPSCI|240"]; 

res1 = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            "id": "COMPSCI|999",
            "prerequisites": cs589,
        }),
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.id, "COMPSCI|999");

// meets prereqs
res1 = await fetch('http://localhost:3000/courses/json/with_prerequisites/MATH|235,MATH|233,COMPSCI|240', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.filter((course) => {course.id == "COMPSCI|999"}).length > 0, true); 
// fails to meet prereqs
res1 = await fetch('http://localhost:3000/courses/json/with_prerequisites/MATH|233,COMPSCI|240', {
    method: 'GET',
    }).then((res) => {return res.json()}); 
assert.strictEqual(res1.filter((course) => {course.id == "COMPSCI|999"}).length > 0, false); 


// res = verifyPrereqExpression(cs589, ["MATH|233","COMPSCI|240"])
// console.log("false = " + res); 
// res = verifyPrereqExpression(cs589, ["MATH|545","COMPSCI|240"])
// console.log("true = " + res); 
// res = verifyPrereqExpression(cs589, ["MATH|235","MATH|233","STAT|515","COMPSCI|240"])
// console.log("true = " + res); 
// res = verifyPrereqExpression(cs589, ["MATH|545", "STAT|515"])
// console.log("false = " + res); 


// DELETE:
// 	DELETE: Delete Course
// 		○ Route: courses/:id
// Response: { course }

console.log("10.\nDELETE Course Success")
res1 = await fetch('http://localhost:3000/courses/COMPSCI|999', {
    method: 'GET',
    }).then((res) => {return res}).catch((err) => console.log("GET Graph error: "+ err));  
assert.strictEqual(res1.id, "COMPSCI|999")

console.log("DELETE Course Repeated")
res1 = await fetch('http://localhost:3000/courses/COMPSCI|999', {
    method: 'GET',
    }).then((res) => {return res}).catch((err) => console.log("GET Graph error: "+ err));  
assert.strictEqual(res1.error, "No course with ID found")

console.log("Reset Tests")
res1 = await fetch('http://localhost:3000/courses/COMPSCI|1000', {
    method: 'GET',
    }).then((res) => {return res}).catch((err) => console.log("GET Graph error: "+ err));  
assert.strictEqual(res1.id, "COMPSCI|1000")

