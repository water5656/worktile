var express = require("express");
var fs = require("fs");
var formidable = require("formidable");

var app = express();
app.use(express.static("www"));

app.get("/getall",function(req,res){
    fs.readFile("./db.json",function(err,data){
        var data = JSON.parse(data).list;
        res.json(data);
    })
});
app.post("/add",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        fs.readFile("./db.json",function(err,data){
            var arr = JSON.parse(data).list;
            var id = arr.reduce((a,b)=>{return a > b.id ? a : b.id},0)+1;
            fields.id = id;
            arr.push(fields);
            arr.sort((a,b)=>a>b)
            fs.writeFile("./db.json",JSON.stringify({list: arr}),function(err,data){
                res.json(arr);
            })
        })
    })  
});
app.delete("/del/:id",function(req,res){
    var id = req.params.id;
    fs.readFile("./db.json",function(err,data){
        var arr = JSON.parse(data).list;
        arr = arr.filter(item=>item.id!=id);
        fs.writeFile("./db.json",JSON.stringify({list:arr}),function(err,data){
            res.json(arr);
        })
    })
});
app.patch("/change/:id",function(req,res){
    var id = req.params.id;
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,{title,start,end,type}){
        fs.readFile("./db.json",function(err,data){
            var arr = JSON.parse(data).list;
            console.log(title)
            arr.map(item => {
                if(item.id == id){
                    item.title = title;
                    item.start = start;
                    item.end = end;
                    item.type = type;
                }
                return item;
            });
            arr.sort((a,b)=>a.start>b.start)
            fs.writeFile("./db.json",JSON.stringify({list:arr}),function(err,data){
                res.json(arr);
            })
        })
    })
});
app.patch("/drag/:id",function(req,res){
    var id = req.params.id;
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,{title,start,end,type}){
        fs.readFile("./db.json",function(err,data){
            var arr = JSON.parse(data).list;
            arr.map(item => {
                if(item.id == id){
                    item.start = start;
                    item.end = end;
                }
                return item;
            });
            arr.sort((a,b)=>a.start>b.start)
            fs.writeFile("./db.json",JSON.stringify({list:arr}),function(err,data){
                res.json(arr);
            })
        })
    })
})

app.listen(3000,function(){
    console.log(3000)
})