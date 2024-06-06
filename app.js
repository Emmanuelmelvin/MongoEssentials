const express = require('express')

//getting the documents ids
const { ObjectId } = require('mongodb')

//import functions from  dbFile
const {connectToDb , getDb} = require('./db')

//init app &middleware
const app = express()
app.use(express.json())

//database connection
let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3000 , ()=>{
            console.log('Listening at port 3000')
        })
    }

    db = getDb()
})


//routes 
app.get('/books', (req, res) =>{
        //init books arrayz
        //pagination technique
    const page = req.query.pages || 0
    const booksPerPage = 2

    let books =[]

    db.collection('books')
    .find() //cursor toArray forEach
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(()=>{
        res.status(200).json(books)
    }) 
    .catch((err)=> {
        res.status(500).json({message: 'could not get message!'})
    })

})

app.get('/books/:id', (req , res) => {
    
    // if(ObjectId.isValid(req.params.id)){

        db.collection('books')
            .findOne({author: req.params.id})
            .then((doc) => {
                res.status(200).json(doc)
            })
            .catch((err) => {
                res.status(500).json({messaage: 'Could not fetch document'})
            })
    // } else{
        // res.status(500).json({erroe: 'Not valid document id'})
    // }

})

//handling post request

app.post('/books' , (req,res)=> {
        const book = req.body
        db.collection('books')
            .insertOne(book)
            .then((result) =>{
                res.status(200).json(result)
             .catch((err) => {
                    res.status(500).json({error: 'Cannot POST data'})
                })
            })
})

//handling delete request
app.delete('/books/:id' , (req , res) => {
         db.collection('books')
            .deleteOne({_id: req.params.id})
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                res.status(500).json({messaage: 'Could not delete document'})
            })
})

//handling patch method
app.patch('/books/:id' , (req , res) => {
        const updates = req.body
        db.collection('books')
            .updateOne( { author: req.params.id } , {$set: updates })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({message : 'Could not update book'})
            })
})



