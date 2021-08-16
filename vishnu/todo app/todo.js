const btn = document.getElementById("btn")
let dBtn =document.getElementById("dBtn")
let lBtn = document.getElementById("lBtn")


function saveText(){
    var valid = document.getElementById("valid")
    var priority = document.getElementById("priority").value
    const textInp = document.getElementById("textInp").value
    const remainderTime = document.getElementById("remainderTime").value
    document.getElementById("textInp").value = " "
    if(textInp=='' && textInp==null) {
        valid.innerHTML +=  "please enter the todo" 
        return false;
    }
    else{
        valid.innerHTML = " "
        true;
    }
    const dates = new Date()
    var created = dates.value
    var todoString = localStorage.getItem("todos")
    var todoList =[]
    if(todoString!=null) {
        todoList = JSON.parse(todoString)
        
    }
    var newTodo = {"todoText": textInp , "date": dates , "priority": priority , "remainderTime": remainderTime}
    todoList.push(newTodo)
    localStorage.setItem("todos",JSON.stringify(todoList))
    console.log(todoList)
    displayLatestList();
    
}

function displayLatestList(){
    var todoString = localStorage.getItem("todos")
    var todoList =[]
    if(todoString!=null){
        todoList = JSON.parse(todoString)
    }
    
    var incompletedTodos = document.getElementById("incompletedTodos")
    var completedTodos = document.getElementById("completedTodos")
    incompletedTodos.innerHTML = " "
    completedTodos.innerHTML = " "
    todoList.forEach((todoObject) => {
        if(todoObject.completed==null && todoObject.priority==10) {
            incompletedTodos.innerHTML += "<label style='background-color:red'>" +  todoObject.todoText +
            "</label><button class='btn btn-success' onclick='completedTask(\"" + todoObject.todoText +"\")' style='font-size:10px;' value:done>done</button><hr>" 
        }
        else if(todoObject.completed==null && todoObject.priority==5) {
            incompletedTodos.innerHTML += "<label style='background-color:orange'>" + todoObject.todoText +
            "</label><button class='btn btn-success' onclick='completedTask(\"" + todoObject.todoText +"\")' style='font-size:10px;' value:done>done</button><hr>" 
        }
         else if(todoObject.completed==null && todoObject.priority==1) {
            incompletedTodos.innerHTML += "<label style='background-color:yellow'>" + todoObject.todoText +
            "</label><button class='btn btn-success' onclick='completedTask(\"" + todoObject.todoText +"\")' style='font-size:10px;' value:done>done</button><hr>" 
        }
        else{ 
            completedTodos.innerHTML += "<label style='background-color:springgreen'>" + todoObject.todoText +  "</label><hr>"
        }
    
    });
    
}
displayLatestList()

function completedTask(todoText){
    if(!confirm("is it ok to take away from the todo list?"))
    return;
    var todoString = localStorage.getItem("todos")
    var pointsGainedToday = document.getElementById("pointsGainedToday")
    var todoList=[]
    if(todoString!= null){
        todoList= JSON.parse(todoString)
    }
    todoList.forEach((todoObject, index)=>{
        if(todoObject.todoText==todoText){
            todoObject.completed = new Date()
            pointsGainedToday.innerHTML += "<label> " + todoObject.priority  +  "+<label><br>"   
        }
    });
     localStorage.setItem("todos", JSON.stringify(todoList));
    displayLatestList()

}



dBtn.addEventListener("click",function(){
       document.body.style.backgroundColor = "#5B5252"
})
lBtn.addEventListener("click",function(){
    document.body.style.backgroundColor = "white"
})

// remainder
var remain = setInterval(remainder,200)

function remainder(){
var todoString = localStorage.getItem("todos")
var todoList =[]
if(todoString!=null){
    todoList = JSON.parse(todoString)
}
var newDate = new Date()

todoList.forEach((todoObject,index)=>{
    var remainder = document.getElementById("remainder")
    var time = todoObject.remainderTime
    console.log(todoObject.remainderTime.getTime())
   
    var timer= newDate.getTime()-time.getTime()

    if(timer<=1500){
        remainder.innerHTML += "<label>" + todoObject.todoText + "</label><hr>"
    }
})
}

