const express=require('express');
const app=express();
const {MongoClient,ObjectId}=require('mongodb');
const port=3002;

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:false}));

const client=new MongoClient('mongodb://127.0.0.1:27017');
let todosCollection;

async function run() {
  try{
    await client.connect();
    console.log('mongoDb is connectded');
    const db=client.db('NoteDb');
    todosCollection=db.collection('todos');
  }catch(err){
    console.log(err);
  }
}
run();

app.get('/',async(req,res)=>{
  const todos=await todosCollection.find().toArray();
  res.render('index',{todos:todos})
});

app.post('/add',async(req,res)=>{
  await todosCollection.insertOne({task:req.body.task,completed:false});
  res.redirect('/');
});

app.post('/complete/:id',async(req,res)=>{
  const id=req.params.id;
  await todosCollection.updateOne({_id:new ObjectId(id)},{$set:{completed:true}});
  res.redirect('/');
});

app.post('/undone/:id',async(req,res)=>{
  const id=req.params.id;
  await todosCollection.updateOne({_id:new ObjectId(id)},{$set:{completed:false}});
  res.redirect('/');
});

app.post('/delete/:id',async(req,res)=>{
  const id =req.params.id;
  await todosCollection.deleteOne({_id:new ObjectId(id)});
  res.redirect('/');
});

app.listen(port,()=>{
  console.log(`server is running at http://localhost:${port}`);
})