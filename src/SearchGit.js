import React from "react";
import Select from 'react-select'

export default class SearchGit extends React.Component {

    options = [
        { value: '', label: '' },
        { value: 'user', label: 'User' },
        { value: 'repository', label: 'Repository' },
      ]


    constructor(props) {
        super(props)
        this.state = { value: '', type: '', loader: false , data: []};

        this.searchValue = this.searchValue.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.selectChange = this.selectChange.bind(this)
    }

    searchValue(event) {
        console.warn(this.state)
        event.preventDefault();
        this.setState({loader: true});
        fetch(this.getSearchUrl())
            .then(response => response.json())
            .then(res => {
                console.warn(res)
                this.setState({data: res.items})
            }).catch(e => {
                console.error(e)
            }).finally(() => {
                this.disableLoader()
            })
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    selectChange(event) {
        console.warn(event.target.value)
        this.setState({ type: event.target.value })
    }

    disableLoader(){
        this.setState({loader: false});
    }

    getSearchUrl() {
        //TODO change if select changed
        return `https://api.github.com/${this.state.type === 'user' ? `search/users?q=${this.state.value}` : `search/repositories?q=${this.state.value}&1,50,sort,order`}`

    }
    logSstate(){
        console.warn(this.state)
    }

    renderTable(){
        
    }

    isValid(){
        return !(!!this.state.type && this.state.value.length > 2) 
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
                    <button type="submit" disabled={this.isValid()}>Search</button>
                </form>
               {    this.state.loader ?<div><h2>Loading data</h2></div> : null}
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
                           {this.state.data.map(e =>{ return <tr>
                               <td>{e.login}</td>
                               <td>{e.repository}</td>

                           </tr>})}
                           </tbody> 
               </table>
               </div>
               : <div>No data found</div>
                }
            </div>
        );
    }
}