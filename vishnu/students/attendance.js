var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) =>{
  if (err) throw err;
  console.log('logged in')
  var dbo = db.db("student");
  dbo.collection("student")
      .find()
      .toArray(async (err, items)=> {
        console.log(items)
        var studentAbsence = {}
        var studAbsence=[]

        var count =0
        var month = 2
        var year = 2021
        var noOfDaysInmonth = daysInMonth(month,year)
        var holidays =findingHolidays()
        console.log(holidays)
        var std = [1,2,3,4,5,6,7,8,9,10,11,12]  
        var sections = ['a','b','c']  
               for(let i=0;i<std.length;i++){   
                for(let j=0;j<sections.length;j++){   
           
                var newArray = items.filter(function (student){ 
             
             return( std[i]== student.standard && sections[j] ==student.section)
                   });  
                    if(newArray.length>0){
        for(let l=1;l<=noOfDaysInmonth;l++){
         
          if(holidays.includes(l)){
            continue;
          }
          else{
            studentAbsence.date =""
            studentAbsence.absence=[]
            studentAbsence.standard =""
            studentAbsence.section =""
            count +=1
          var noOfAbsentees=randomNumber(1,6)
          
          for(let i=0;i<noOfAbsentees;i++){
          absenteesIndex = randomNumber(0,newArray.length)
          
          
          studentAbsence.absence.push(newArray[absenteesIndex].username)
          
          }
          studentAbsence.date=(`${l}/${month}/${year}`)
          studentAbsence.standard =(newArray[absenteesIndex].standard)
          studentAbsence.section=(newArray[absenteesIndex].section)
          // studAbsence.push(studentAbsence)
          try{
            const database= await dbo.collection('attendance').insertOne(studentAbsence)
            studentAbsence={}
            }catch (err){
              console.log(err)
            }
    }
      }
       
        // console.log(studAbsence)
      
        
        }
                }
              }
    
  });
});

function randomNumber(min, max) { 
      return Math.floor(Math.random() * (max - min) + min);
    } 
    function findingHolidays(){
      var d = new Date();
      var getTot = daysInMonth(d.getMonth(),d.getFullYear()); 
      var holiday =[]
        
      
      for(var i=1;i<=getTot;i++){   
          var newDate = new Date(d.getFullYear(),d.getMonth(),i)
          if(newDate.getDay()==0 || newDate.getDay()==6){ 
              holiday.push(i);
          }
         
      
      }
      return holiday;
      }
      
      function daysInMonth(month,year) {
          return new Date(year, month, 0).getDate();
      }
      
    
              
