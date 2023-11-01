import {writeFileSync, readFileSync} from 'fs'
import { verifyPrereqExpression, getPrereqExpressionVariables } from './verifyPrequisites.js';

export class CourseList {
    constructor(filename){ // Read JSON of Courses when Initialized 
        this.file = JSON.parse(readFileSync(filename, (err, data) => {return data;}));
    }
    
    getCourseList(){ // Accessor method for Course JSON
        return this.file; 
    }

    getCourseByID(id){
        let course = this.file.filter((c) => (c.id == id));
        if (course.length > 0){
            return course[0]; 
        } else {
            return null; 
        }
    }

    followsConvention(testJSON){
        // Accepted IDs, except for those not containing strings
        let format = ["id","subjectLong","subjectShort","subjectId","number","topic",
        "displayTitle","title","titleLong","description","corequisites"];
        let flag = true; 
        Object.keys(testJSON).forEach((key) => {
            if (key == "prerequisites") {
                // Prerequisites needs to be array or null
                if (!Array.isArray(testJSON[key]) && testJSON[key] != null){
                    flag = false; 
                } else {
                    // CORRECT FORMAT : CONTINUE
                }
            } else if (key == "hasRestrictions" || key == "hasTopics"){
                // / hasRestrictions needs to be boolean or null
                if (typeof(testJSON[key]) != "boolean" && testJSON[key] != null){
                    flag = false; 
                } else {
                    // CORRECT FORMAT : CONTINUE
                }
            } else if (format.includes(key)){
                // other keys need to be Strings
                if (typeof(testJSON[key]) != "string" && testJSON[key] != null){
                    flag = false; 
                } else {
                    // CORRECT FORMAT : CONTINUE
                }
            } else {
                // Named key doesn't exist in the convention
                flag = false; 
            }
        });
        return flag; 
    }

    addCourse(newCourse){ 
        let exists = this.getCourseByID(newCourse.id); 
        if (exists != null){ // already exist
            return null; 
        } else {
            this.file.push(newCourse);
            this.saveToFile();
            return newCourse; 
        }
    }

    updateCourse(courseID, course_data){ 
        let course = this.getCourseByID(courseID); 
        if (course == null) {
            return null; // COURSE NOT FOUND
        } 
        Object.keys(course_data).forEach((key) => {
            course[key] = course_data[key]; 
        })
        this.saveToFile(); 
        return course;   
    }

    deleteCourse(deletedCourseID){ 
        console.log("DELETING " + deletedCourseID)
        const deletedCourse = this.getCourseByID(deletedCourseID);
        if (deletedCourse == null){ // doesn't exist
            console.log("Doesn't Exist " + deletedCourseID)

            return null; 
        } else { // does exist
            console.log("Does Exist " + deletedCourseID)

            let courseCopy = {... deletedCourse} // copy deleted course
            this.file = this.file.filter((c) => c.id != deletedCourseID);
            this.saveToFile(); 
            return courseCopy; 
        }
    }

    getPossibleCoursesList(courseIDList){
        let possibleCoursesList = []
        this.file.forEach((c) => { // For every course
            if (c.prerequisites != null && Array.isArray(c.prerequisites)){
                // Course with Array
                if (c.prerequisites.length > 0){
                    // Course has prerequisites
                    if (verifyPrereqExpression(c.prerequisites, courseIDList)){
                        possibleCoursesList.push(c); 
                    }
                } else {
                    // Courses with no prerequisites
                }       
            } else { // Courses with no prerequisites
                
            }
        });
        return possibleCoursesList; 
    }

    getGraphNodes(){
        let graphNodes= [];
        // Color scheme for each 100 level of class
        let colors = ["#5B38D3","#6E44FF","#B892FF","#FFC2E2",
        "#FF90B3","#EF7A85","#F08690","#F1919A"];
        let num = 0; 
        this.file.forEach((c) => { // Some courses start with letters. 
            if (isNaN(parseInt(c.number))){
                num = colors.length-1; 
            } else {
                // Assign different colors for each 100 level of class
                num = Math.min(Math.floor(parseInt(c.number)/100), colors.length-1);
            }
            graphNodes.push({"key":c.id, "color":colors[num]});
        });
        return graphNodes;
    }

    getGraphEdges(){ 
        let edges = []
        this.file.forEach((c) => {
            if (c.prerequisites != null && c.prerequisites.length > 0){
                getPrereqExpressionVariables(c.prerequisites).forEach((prereqID) => {
                    edges.push({"from": prereqID, "to":c.id, "text":""});
                }); 
            }
        })
        return edges;   
    }

    saveToFile(){ // Write to file helper method
        writeFileSync('./modules/courses.json', JSON.stringify(this.file))
    }
}

