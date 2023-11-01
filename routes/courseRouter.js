import { Router } from "express"; 
import { CourseList } from "../modules/courseInterface.js";
import jsonPrettyHtml from 'json-pretty-html';
import path from "path";
 

const courseRouter = Router();


////// CREATE ROUTES: //////
courseRouter.post('/', (req,res) => {
    res.set('Content-Type','application/json');
    console.log(req.body);
    const courseInterface = new CourseList('./modules/courses.json'); 
    if (!courseInterface.followsConvention(req.body)){
        res.status(404).send({"error": "Course body does not follow convention"}); 
        return; 
    }
    const addedCourse = courseInterface.addCourse(req.body) 
    if(addedCourse == null){
        res.status(404).send({"error": "Course has duplicate ID"})
    } else {
        res.send(addedCourse); 
    }
});

////// READ ROUTES: //////

courseRouter.get('/json/:id', (req,res) => {
    // Response: HTML containing JSON
    res.set('Content-Type','text/html');
    const courseInterface = new CourseList('./modules/courses.json'); 
    const course = courseInterface.getCourseByID(req.params.id)
    if (course == null) {
        res.status(404).send({"error":"Course not found"})
    } else {
        // res.send(jsonPrettyHtml.default(course)) // pretty JSON
        res.send(course) // raw JSON
    }
}); 

courseRouter.get('/graph', (req,res) => {
    // Response: HTML containing Echarts
    const courseInterface = new CourseList('./modules/courses.json'); 
    res.sendFile(path.resolve('views/gojs.html'))
}); 

courseRouter.get('/graphedges', (req,res) => {
    // Response: JSON containing graphedges
    const courseInterface = new CourseList('./modules/courses.json'); 
    let edges = courseInterface.getGraphEdges(); 
    res.send(edges);
}); 
courseRouter.get('/graphnodes', (req,res) => {
    // Response: JSON containing graphnodes
    const courseInterface = new CourseList('./modules/courses.json'); 
    let nodes = courseInterface.getGraphNodes(); 
    res.send(nodes);
}); 

courseRouter.get('/json', (req,res) => {
    // Response: HTML containing JSON
    res.set('Content-Type','text/html');
    const courseInterface = new CourseList('./modules/courses.json'); 
    const list = courseInterface.getCourseList();
    if (list == null){
        res.status(404).send("Data not found")
    } else {
        // res.send(jsonPrettyHtml.default(list)) // pretty JSON
        res.send(list) // raw JSON    
    }
}); 

courseRouter.get('/json/with_prerequisites/:id_list', (req,res) => {
    // Response: HTML containing JSON
    const courseInterface = new CourseList('./modules/courses.json'); 
    console.log(req.params.id_list.split(','))
    const list = courseInterface.getPossibleCoursesList(req.params.id_list.split(','));
    // res.send(jsonPrettyHtml.default(list)) // pretty JSON
    res.send(list) // raw JSON
}); 

////// UPDATE ROUTES //////
courseRouter.patch('/', (req,res) => {
    // Request: {"id":"", "course_data":{}}
    // Response: { course }
    const courseInterface = new CourseList('./modules/courses.json'); 
    if (!Object.keys(req.body).includes("course_data")){
        res.status(404).send({"error": "Update must have a course_data object"});
        return; 
    } else if (Object.keys(req.body.course_data).includes("id")){
        res.status(404).send({"error": "Update cannot include ID"});
        return;
    } else if (!courseInterface.followsConvention(req.body.course_data)){
        res.status(404).send({"error": "Course body does not follow convention"});
        return;
    }
    const response = courseInterface.updateCourse(req.body.id, req.body.course_data);
    if (response == null){
        res.status(404).send({"error":"Course ID not Found"})
    } else {
        res.send(response);  
    }
});

courseRouter.patch('/prerequisites', (req,res) => {
    // Request: {"id":"", "prerequisites":[]}
    // Response: { course }
    console.log("prerequisites: "+ Object.keys(req.body).includes("prerequisites"))
    if (!Object.keys(req.body).includes("prerequisites") || (!Array.isArray(req.body.prerequisites) && req.body.prerequisites != null)){
        console.log("incorrect body")
        res.status(404).send({"error":"Malformed Request Body"})
        return; 
    }
    const courseInterface = new CourseList('./modules/courses.json'); 
    const response = courseInterface.updateCourse(req.body.id, {"prerequisites":req.body.prerequisites});
    if (response == null){
        res.status(404).send({"error":"Course ID not Found"})
    } else {
        console.log('correct request')
        res.send(response);  
    }
});

////// DELETE ROUTES: //////
courseRouter.delete('/:id', (req,res) => {
    // Request: {"id":{} "prerequisites":[]}
    // Response: { course }
    const courseInterface = new CourseList('./modules/courses.json'); 
    const deletedCourse = courseInterface.deleteCourse(req.params.id); 
    if (deletedCourse == null){
        res.status(404).send({"error": "No course with ID found"});
    } else {
        res.send(deletedCourse);
    }
});

export default courseRouter; 