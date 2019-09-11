import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries'
import {flowRight as compose} from 'lodash'
    
class AddBook extends Component {

    constructor(props){
        super(props)
        this.state = {
            name: '',
            genre: '',
            authorId: ''
        }
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value 
        })
    }

    handelSubmit = (e) => {
        e.preventDefault()
        console.log(this.state)
        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [{ query: getBooksQuery }]
        })
    }
    displayAuthors(){
        var data = this.props.getAuthorsQuery
        
        if(data.loading){
            return( <option disabled>Loading authors...</option> )
        }else{
            return data.authors.map(author => {
                return(
                    <option key={ author.id } value={ author.id }  >{ author.name }</option>
                )
            })
        }
    }
    render(){
        return(
            <form id="add-book" onSubmit={ this.handelSubmit} >
                <div className="field">
                    <label>Book Name:</label>
                    <input type="text" id="name"  onChange={this.handleChange} />
                </div>
                <div className="field">
                    <label>Genre:</label>
                    <input type="text" id="genre"  onChange={this.handleChange} />
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select id="authorId" onChange={this.handleChange}>
                        <option>select author</option>
                        {this.displayAuthors()}
                    </select>                
                </div>
                <button>Add</button>
            </form>
        )
    }
}
export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook)