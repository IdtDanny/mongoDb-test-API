const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

// init app & middleware
const app = express()
app.use(express.json()) // middleware for use in handler

// db connetion
let db

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})

// routes
app.get('/books', (req, res) => {

    // pagination - current page
    const page = req.query.p || 0

    const booksPerPage = 2

    let books = []

    // same as db.books...
    db.collection('books')
        .find() // return the cursor (toArray or forEach)
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })

    // res.json({mssg: "welcome to the api"})
})

app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)){

        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })

    } else {
        res.status(500).json({error: 'Not valid doc id'}) 
    }
})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({erro: 'Could not create a new document'})
        })
})

app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)){

        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not delete the documents'})
        })

    } else {
        res.status(500).json({error: 'Not valid doc id'}) 
    }
})

// Update handle
app.patch('/books/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)){

        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not update the documents'})
        })

    } else {
        res.status(500).json({error: 'Not valid doc id'}) 
    }

})