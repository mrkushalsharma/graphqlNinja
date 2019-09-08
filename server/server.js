const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/graphql' ,  {useNewUrlParser: true}, () => {
    console.log('db connected')
})
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(5000,() => {
    console.log('listening on port 5000')
})