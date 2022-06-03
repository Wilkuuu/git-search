import React from "react";
import Select from 'react-select'

export default class SearchGit extends React.Component {

    options = [
        { value: 'user', label: 'User' },
        { value: 'repository', label: 'Repository' },
      ]


    constructor(props) {
        super(props)
        this.state = { value: '', type: '' };

        this.searchValue = this.searchValue.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.selectChange = this.selectChange.bind(this)
    }

    searchValue(event) {
        console.warn(this.state)
        event.preventDefault();
        fetch(this.getSearchUrl())
            .then(response => response.json())
            .then(res => {
                console.warn(res)
            }).catch(e => {
                console.error(e)
            })
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    selectChange(event) {
        console.warn(event.target.value)
        this.setState({ type: event.target.value })
    }

    getSearchUrl() {
        //TODO change if select changed
        return `https://api.github.com/${this.state.type === 'user' ? `users/${this.state.value}` : `search/repositories?q=${this.state.value}&1,50,sort,order`}`

    }

    render() {
        return (
            <div>
                <div>Git Searcher </div>
                <form onSubmit={this.searchValue}>
                    <input type="text" value={this.state.value} onChange={this.handleChange} ></input>
                    <select value={this.state.type} onChange={this.selectChange}>
                      {this.options.map(e => <option value={e.value} key={e.label}>{e.label}</option>)}
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>
        );
    }
}