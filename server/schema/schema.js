const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLObjectType, GraphQLSchema, GraphQLString } = graphql

var books = [
    {name: 'c prog',genre: 'prog', id: '1'},
    {name: 'c++ prog',genre: 'prog', id: '2'},
    {name: 'c physic',genre: 'phy', id: '3'},
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        genre: { type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: {id: { type: GraphQLString }},
            resolve(parent, args){
                // args.id
                //code to extract data from database
                return _.find(books, {id: args.id})         
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
})