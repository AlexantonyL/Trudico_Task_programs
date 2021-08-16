const express = require("express")
const app = express()
const { MongoClient, ObjectId } = require("mongodb")
const bodyparser = require("body-parser")
const ObjectID = require('mongodb').ObjectID
const mongo = require("mongodb")


let db 
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let connectionString = `mongodb://localhost:27017/student`

MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db('student')
    db.collection('student').createIndex({"username":1},{unique:true})
    app.listen(5000)
  }
)



app.use(express.json())
app.set('view engine','ejs')

app.get('/', function (req, res) {
    db.collection('student')
      .find()
      .toArray(function (err, items) {
        
        res.render("index",{items:items})
      })
  })

  app.post('/getAttendance', function (req, res) {
    var std = parseInt(req.body.std)
 var sec = req.body.sec
 var totalAttendancePercentage =0
    db.collection('student').find({standard:std,section:sec}).toArray(function (err, items) {
      var noOfStudents = items.length
      
      db.collection('attendance').find({standard:std,section:sec}).toArray(function (err,absentees){
        noOfWorkingDays = absentees.length
        
       absentees.forEach(absentee => {
        
         noOfAbsentees = absentee.absence.length
        
        var noOfPresent = noOfStudents - noOfAbsentees
         attendancePercentage = ((noOfPresent/noOfStudents)*100).toFixed(2)
         
        totalAttendancePercentage =parseInt(totalAttendancePercentage)+parseInt(attendancePercentage)
        
         });
         var totalPercentage = (totalAttendancePercentage/noOfWorkingDays).toFixed(2)
         console.log(totalAttendancePercentage)
        res.render("attendance",{absentees:absentees,totalPercentage:totalPercentage,standard:std,section:sec})
      })
  })
})


  app.get('/gettingStudent', function (req, res) {
   
 var limitStudents = parseInt(req.query.limit)|| 10;
 var skipStudents = parseInt(req.query.skip)|| 0
 db.collection('student').find().toArray(function (err,items){
        var noOfstudents = items.length
        var noOfpages = Math.ceil(noOfstudents/limitStudents)
        
        db.collection('student').find().skip(skipStudents).limit(limitStudents).toArray(function (err,items){
        res.render("try",{items:items,noOfpages: noOfpages,
          noOfstudents:noOfstudents,
          limitStudents:limitStudents,
          skipStudents:skipStudents})
        console.log(noOfpages)
      })
 
      })
        
      
  })
  
// search api
app.post('/getStudents',(req,res)=>{
 var std = parseInt(req.body.std) ||  parseInt(req.query.std)
 var sec = req.body.sec ||  req.query.sec
 var limitStudents = parseInt(req.query.limit)|| 5;
 var skipStudents = parseInt(req.query.skip)|| 0
 console.log(skipStudents)
 console.log(limitStudents)
 db.collection('student').find({standard:std,section:sec}).toArray(function (err,items){
        var noOfstudents = items.length
        var noOfpages = Math.ceil(noOfstudents/limitStudents)
        
        db.collection('student').find({standard:std,section:sec}).skip(skipStudents).limit(limitStudents).toArray(function (err,items){
        res.render("index1",{items:items,
          noOfpages: noOfpages,
          noOfstudents:noOfstudents,
          limitStudents:limitStudents,
          skipStudents:skipStudents,
        sec:sec,
      std:std})
      })
 
      })
    })



  app.get("/addStudent", (req, res)=> {
    res.sendFile(__dirname + "/addstudent.html");
  })

  app.post('/addStudent', function (req, res) {
      
    db.collection('student').insertOne(req.body,(err,result)=>{
      res.redirect('/')
      console.log(result)
    })
  })



    app.get("/updateStudent/:id", (req, res)=> {
        var id = req.params.id;
    db.collection('student').find(mongo.ObjectId(id)).toArray((err,items) => {
        res.render('edit.ejs', { items:items });
        
    });
       
      })

    app.post('/updateStudent/:id', function (req, res) {
        var id = req.params.id;
        var name = req.body.name
        var standard = req.body.standard
        var section = req.body.section
        var gender = req.body.gender
        
        db.collection('student').findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { name: req.body.name,
            standard: req.body.standard,
            section: req.body.section,
           gender: req.body.gender} },
        
            res.redirect('/')
          
        )
      })


     
app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
  db.collection('student').deleteOne(
    { _id:ObjectId(id) },
    
      res.redirect('/')
    
    )
})

