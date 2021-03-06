const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: {
        type: String,
        ref: 'Author'
    }
})

module.exports = model('Book',bookSchema)