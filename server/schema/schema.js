const graphql = require('graphql')
const _ = require('lodash')
const { Types: { ObjectId } } = require('mongoose')

const Book = require('../models/book')
const Author = require('../models/author')

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull } = graphql

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        }  
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: { type: GraphQLInt},
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorId: parent.id})
                return Book.find({authorId: parent.id})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args){
                // args.id
                //code to extract data from database
                // return _.find(books, {id: args.id})
                return Book.findById(args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({})

            }
        },
        author: {
            type: AuthorType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args){
                // args.id
                //code to extract data from database
                // return _.find(authors, {id: args.id})
                return Author.findById(args.id)

            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
                return Author.find({})

            }
        },
    })
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                //create a instance of author model
                let author = new Author()
                author.name = args.name
                author.age = args.age
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)  },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book()
                book.name = args.name
                book.genre = args.genre
                book.authorId = args.authorId
                return book.save()
            }
        },
        deleteBook: {
            type: BookType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                return Book.findByIdAndRemove(args.id)
            }
        },
        updateBook: {
            type: BookType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString  },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            async resolve(parent,args){
                console.log(args.id)
                const book = await Book.findOne({_id:args.id})
                console.log(book)
                if(args.name)
                    book.name = args.name
                if(args.genre)
                    book.genre = args.genre
                if(args.authorId)
                    book.authorId = args.authorId

                book.save()
                return book
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation: Mutation
})