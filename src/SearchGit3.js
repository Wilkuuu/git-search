import React, { useState, useEffect } from "react";
import './App.css';

const useKeyPress = function(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };
    useEffect(() => {
        setKeyPressed(false)
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    });

    return keyPressed;
};

const GitSearch3 = () => {
    const [searchValue, setSearchValue] = useState('');
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [cursor, setCursor] = useState(0);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [gitData, setGitData] = useState([]);

    const search = async (event) => {
        event.preventDefault();
        setIsLoaded(false)
        setError(null)
        await Promise.all([
            fetch(`https://api.github.com/search/users?q=${searchValue}&page=1&per_page=50`),
            fetch(`https://api.github.com/search/repositories?q=${searchValue}&page=1&per_page=50`)
        ]).then( (responses) => {
            return Promise.all(responses.map( (response) => {
                return response.json();
            }));
        }).then( (data) => {
            let compareData = []
            data.forEach(e =>  compareData = compareData.concat(e.items))
            compareData = compareData.map(e => {return {...e, tempName: e.login || e.name, type: e.type || 'Repository'}})
            compareData = compareData.sort((a,b) => a.tempName.localeCompare(b.tempName))
            setGitData(compareData)

        }).catch( (error) => {
            setError(error)
            console.log(error);
        }).finally(() => {
            setIsLoaded(true)

        });

    }


    useEffect(() => {
        if (gitData.length && downPress) {
            setCursor(currentPosition =>
                currentPosition < gitData.length - 1 ? currentPosition + 1 : currentPosition
            );
        }
    }, [downPress, gitData.length]);
    useEffect(() => {
        if (gitData.length && upPress) {
            setCursor(currentPosition => (currentPosition > 0 ? currentPosition - 1 : currentPosition));
        }
    }, [upPress, gitData.length]);
    useEffect(() => {
        if (gitData.length && enterPress) {
            window.open(gitData[cursor].html_url, '_blank', 'noopener,noreferrer')
        }
    }, [cursor, enterPress, gitData]);

    return (
        <div>
            <h2>GitSearch 3</h2>
            <div>
                <form onSubmit={search} >
                    <input name="searchValue" value={searchValue} type="text" onChange={e => setSearchValue(e.target.value)}></input>
                    <button type="submit" disabled={searchValue.length < 3}>Search</button>
                </form>
            </div>
            {!isLoaded ? <div><h2>Loading data</h2></div> : null}
            {gitData.length ?
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                {gitData.map((e, i) => {
                    return <tr className={`${i === cursor ? "selected" : ""}`} onClick={() => setCursor(i)}
                               >
                        <td>{i + 1}</td>
                        <td>{e.tempName}</td>
                        <td>{e.type}</td>
                    </tr>
                })}
                </tbody>
            </table>
                : null}
            {
                error ?
                    <div>
                        <h2>Error</h2>
                        <div>{error.message}</div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default GitSearch3;
