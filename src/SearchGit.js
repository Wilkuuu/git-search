import React, {useState, useCallback} from "react";
import './App.css';
export default class SearchGit extends React.Component {

    options = [
        {value: '', label: ''},
        {value: 'user', label: 'User'},
        {value: 'repository', label: 'Repository'},
    ]


    constructor(props) {
        super(props)
        this.state = {
            value: '',
            type: '',
            loader: false,
            data: [],
            error: false,
            cursor: 0,
            result: [],
            activeId: ''
        };
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.searchValue = this.searchValue.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.selectChange = this.selectChange.bind(this)
        this.selectItem = this.selectItem.bind(this)
    }

    handleKeyDown(e) {
        const { cursor, result } = this.state
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38 && cursor > 0) {
            this.setState( prevState => ({
                cursor: prevState.cursor - 1
            }))
        } else if (e.keyCode === 40 && cursor < result.length - 1) {
            this.setState( prevState => ({
                cursor: prevState.cursor + 1
            }))
        }
    }

    selectItem(e, i){
        this.setState({activeId: i})
        console.warn('selectImte', i ,e)
    }

    searchValue(event) {
        event.preventDefault();
        this.setState({loader: true});
        fetch(this.getSearchUrl())
            .then(response => response.json())
            .then(res => {
                console.warn(res)
                if (res)
                    this.setState({data: res.items || []})
            }).catch(e => {
            console.error('MY EERROR', e)
            this.setState({error: e})
        }).finally(() => {
            this.disableLoader()
        })
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }


    selectChange(event) {
        console.warn(event.target.value)
        this.setState({type: event.target.value})
    }

    disableLoader() {
        this.setState({loader: false});
    }

    getSearchUrl() {
        return `https://api.github.com/${this.state.type === 'user' ? `search/users?q=${this.state.value}&page=1&per_page=50` : `search/repositories?q=${this.state.value}&page=1&per_page=50`}`

    }



    isValid() {
        return !(!!this.state.type && this.state.value.length > 2)
    }

    render() {
        return (
            <div>
                <div>Git Searcher</div>
                <form onSubmit={this.searchValue}>
                    <input type="text" value={this.state.value} onChange={this.handleChange}></input>
                    <select value={this.state.type} onChange={this.selectChange}>
                        {this.options.map(e => <option value={e.value} key={e.label}>{e.label}</option>)}
                    </select>
                    <button type="submit" disabled={this.isValid()}>Search</button>
                </form>
                {this.state.loader ? <div><h2>Loading data</h2></div> : null}
                {
                    this.state.data.length ?
                        <div >
                            <table>
                                <thead>
                                <tr>
                                    <th>User name</th>
                                    <th>Repository name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.data.map((e, i) => {
                                    return <tr  className={i === this.state.activeId ? "selected" : ""} onClick={() => this.selectItem(e, i)} onKeyDown={ this.handleKeyDown }>
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
}