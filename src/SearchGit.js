import React from "react";

export default class SearchGit extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: ''};

        this.searchValue = this.searchValue.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    searchValue(event){
        console.warn(this.state.value, this.props.searchType)
        event.preventDefault();
        fetch(this.getSearchUrl())
            .then(response => response.json())
            .then(res => {
                console.warn(res)
            }).catch(e => {
                console.error(e)
            })
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }

    getSearchUrl(){
        return `https://api.github.com/${this.props.searchType === 'user' ? `users/${this.state.value}` : `search/repositories?q=${this.state.value}{&page,50,sort,order}`}`

    }

    render(){
        return (
            <div>
           <div>Git Searcher {this.props.searchType}</div> 
           <form onSubmit={this.searchValue}>     
           <input type="text" value={this.state.value} onChange={this.handleChange} ></input>       
           <button type="submit">Search</button>   
           </form>
           </div>
        );
    }
}