import Express from "express";
import courseRouter from "./routes/courseRouter.js"
import morgan from "morgan";
const port = process.env.PORT || 3000; 

const app = Express(); 

app.use(Express.json()); 
app.use(morgan("tiny")); 
app.use('/courses/', courseRouter);

app.listen(port, ()=> {
    console.log(`App is listening on port ${port}`)
}); 