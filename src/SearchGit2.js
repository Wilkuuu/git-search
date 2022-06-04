import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

const options = [
    { value: '', label: '' },
    { value: 'user', label: 'User' },
    { value: 'repository', label: 'Repository' },
]

function searchValue(event) {
    console.warn(this.state)
    event.preventDefault();
    this.setState({ loader: true });
    fetch(this.getSearchUrl())
        .then(response => response.json())
        .then(res => {
            console.warn(res)
            if(res)
                this.setState({ data: res.items || [] })
        }).catch(e => {
        console.error('MY EERROR', e)
        this.setState({ error: e })
    }).finally(() => {
        this.disableLoader()
    })
}
function handleChange(event) {
    this.setState({ value: event.target.value })
}

function selectChange(event) {
    console.warn(event.target.value)
    this.setState({ type: event.target.value })
}

function disableLoader() {
    this.setState({ loader: false });
}

function getSearchUrl() {
    return `https://api.github.com/${this.state.type === 'user' ? `search/users?q=${this.state.value}&page=1&per_page=50` : `search/repositories?q=${this.state.value}&page=1&per_page=50`}`

}
function logSstate() {
    console.warn(this.state)
}





export function SearchGit2() {

    const isValid = useCallback(() =>{
        return !(!!this.state.type && this.state.value.length > 2)} )

        let state = { value: '', type: '', loader: false, data: [], error: false };



        return (
            <div>
                <div>Git Searcher 2 </div>
                <form onSubmit={this.searchValue}>
                    <input type="text" value={this.state.value} onChange={this.handleChange} ></input>
                    <select value={this.state.type} onChange={this.selectChange}>
                        {this.options.map(e => <option value={e.value} key={e.label}>{e.label}</option>)}
                    </select>
                    <button type="submit" disabled={this.isValid}>Search</button>
                </form>
                {this.state.loader ? <div><h2>Loading data</h2></div> : null}
                {
                    this.state.data.length ?
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User name</th>
                                        <th>Repository name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map(e => {
                                        return <tr >
                                            <td>{e.login}</td>
                                            <td>{e.name}</td>

                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        : <div>No data found</div>
                }
                {
                    this.state.error ?
                        <div>
                            <h2>Error</h2>
                            <div>{this.state.error.message}</div>
                        </div>
                        :
                        null
                }
            </div>
        );

}
const rootElement = document.getElementById("root");
ReactDOM.render(<SearchGit2 />, rootElement);