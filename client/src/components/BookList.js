import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import { getBooksQuery, deleteBookMutation } from '../queries/queries'
import BookDetails from './BookDetails'
import {flowRight as compose} from 'lodash'

class BookList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: null,
        }
    }
    deleteBook(id){
        this.props.deleteBookMutation({
            variables: {
                id: id,
            },
            refetchQueries: [{ query: getBooksQuery }]
        })
    }
    displayBooks(){
        var data = this.props.getBooksQuery;
        if(data.loading){
            return( <div>Loading books...</div> )
        } else {
            return data.books.map(book => {
                return(
                    <li key={ book.id }>
                    <p onClick={ (e) => this.setState({ selected: book.id }) } >{ book.name }</p>
                    <button onClick={this.deleteBook.bind(this, book.id)}>Delete</button>
                    </li>

                )
            })
        }
    }

    render(){
        return(
            <div>
                <ul id="book-list">
                { this.displayBooks() }
                </ul>
                <BookDetails bookId={ this.state.selected } />
            </div>
        );
    }
}


export default compose(
    graphql(getBooksQuery, { name: "getBooksQuery" }),
    graphql(deleteBookMutation, { name: "deleteBookMutation" })
)(BookList)