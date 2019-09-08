const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = graphql

var books = [
    {name: 'c prog',genre: 'prog', id: '1', authorId:'1'},
    {name: 'c++ prog',genre: 'prog', id: '2', authorId:'2'},
    {name: 'c physic',genre: 'phy', id: '3', authorId:'3'},
    {name: 'chem',genre: 'chemsitry', id: '4', authorId:'3'},
    {name: 'physic',genre: 'phy', id: '5', authorId:'1'},
    {name: 'dundamental chem vol1',genre: 'chemistry', id: '6', authorId:'2'},


]
var movies = [
    {name: 'titanic',category: 'prog', id: '1'},
    {name: 'movie',category: 'prog', id: '2'},
    {name: 'aasscccas',category: 'phy', id: '3'},
]
var authors = [
    {name: 'ram', age: 20, id: '1'},
    {name: 'shyam', age: 30, id: '2'},
    {name: 'hari', age: 40, id: '3'},
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId})
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
        book:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, {authorId: parent.id})
            }
        }
    })
})

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        category: { type: GraphQLString}
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
                return _.find(books, {id: args.id})
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books
            }
        },
        movie: {
            type: MovieType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args){
                // args.id
                //code to extract data from database
                return _.find(movies, {id: args.id})
            }
        },
        author: {
            type: AuthorType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args){
                // args.id
                //code to extract data from database
                return _.find(authors, {id: args.id})
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
})