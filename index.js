const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const multerData = multer();

//middleware
app.use(express.json());
app.use(multerData.array());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //http://localhost:3000/index.css-> api or http://localhost:3000/img/iphone.jpg

checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.gender || !req.body.age) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing name, age or gender'
      });
    }
    next();
  };

//sync call
const students = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

//get all students
app.get('/', (req, res)=>{
    res.status(200).json({
        status:'sccuess',
        length: students.length,
        data:{
            students
        }
    })
})

//create new students
app.post('/studentsdata', checkBody, (req, res)=>{
    const { age } = req.body;
    if(age>= 50){
     req.body.age = 'Old'
    } else if(age< 50 && age>=20 ){
        req.body.age = 'Adult'
    } else if( age< 20 && age>=5){
        req.body.age = 'Child'
    } else if( age<4 && age>=0){
        req.body.age = 'Kid'
    }

    const newStudent = req.body
    students.push(newStudent);
    fs.writeFile('./data.json', JSON.stringify(students), (err)=>{
        res.status(200).json({
            status:'sccuess',
            data:{
                newStudent
            }
        })

    })
})

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`);
})