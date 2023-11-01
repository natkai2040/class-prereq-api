# class-prereq-app

# Overview: 

This API is designed to support adding courses in a Database, along with their pre-requisites to other courses within the database. These dependencies can be interacted with: you can search for possible courses to take based on the courses already completed, or view a graph of course prereqs (which does not distinguish between optional prereqs or not) represented as edges. 

# Usage: 

**1. Download Files** \
**2. Run `npm install` to install libraries and dependencies** \
**3. Run `npm run dev` or `node index.js` to start server** \

# Courses/Prerequisite Structure: 

A Course is a JSON object containing all these keys: 

"id", "subjectLong", "subjectShort", "subjectId", "number", "topic", "displayTitle", "title", "titleLong, "description","corequisites": String  
"hasTopics": boolean  
"hasRestrictions": boolean  
"prerequisites": Prerequisite[]   
"hasRestrictions": boolean  
All of these fields may be null except for id, as this is the primary key for finding this course. The id must also be unique. [Currently fixing bugs due to updating courses missing keys, so all keys must be added for now]  

A Prerequisite is an Array of the form:  
- The first index of the array is the operation: "AND" or "OR"  
- The remaining indexes of the array are the tokens being acted upon by the operation:  
  - IDs of courses (Strings)  
  - Nested Prerequisite arrays
  
If all courses in a Prerequisite array must be taken, then the operation must be an "AND". If only one course of a selection must be taken, then the operation must be "OR". Ignore grades and major requirements  
For example: CS 589, whose prerequisities are "MATH 545 and COMPSCI 240 and STATS 515 C or better. MATH 545 can be skipped by students who have taken MATH 235 and MATH 233 both with B+ or better. STATS 515 can be skipped by students who have taken COMPSCI 240 with a B+ or better" can have its prerequisites array represented as "prerequisites": ["AND", ["OR","MATH|545", ["AND","MATH|235","MATH|233"]], ["OR", "STATISTC|515", "COMPSCI|240"], "COMPSCI|240"]; 

Here are the routes:

# CREATE:

**POST: Add New Course to the List**

- Route: /courses  
Request: { course }  
Response: The course added, { course } or { error: }  
# READ:

**GET: Course Given ID of course, Represented as JSON**

- Route: courses/:id  
Response: { course } or { error: }  
GET: All Courses, Represented as a Graph  

- Route: /courses/graph  
Response: HTML  
GET: All Courses, Represented as a JSON  

- Route: /courses/json  
Response: [{ course },{ course },...]  
GET: All Courses, represented as graphnodes  

- Route: /courses/graphnodes  
Response:  [{ course },{ course },...]  
GET: All Course Prerequisite Dependencies, represented as graph edges  

- Route: /courses/graphedges  
Response:  [{ course },{ course },...]  
GET: Courses able to be taken, given a set of prerequisites, Represented as a JSON  

- Route: courses/json/with_prerequisites/:id_list  
Route Parameter is List of CourseIDs of the prereqs, delimited by commas  
Example: /CS|111,CS|240  
Response:  [{ course },{ course },...]  
# UPDATE:

**PATCH: Change Course Data. NOTE: Data Cannot Include "id"**

- Route: courses/  
Request: {"id":"", "course_data": { course }}  
Response: The course updated, { course } or { error: }  
PATCH: Change Prerequisites. (just a streamlined version of changing course data for specifically prereqs)  

- Route: courses/prerequisites  
Request: {"id":"", "prerequisites":[]}  
Response: The course updated, { course } or { error: }  
# DELETE:

**DELETE: Delete Course**

- Route: courses/:id  
Response: The course deleted, { course } or { error: }  
