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

    React.useEffect(() => {
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
    const [selected, setSelected] = useState(undefined);
    const [searchValue, setSearchValue] = useState('');
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [cursor, setCursor] = useState(0);
    const [hovered, setHovered] = useState(undefined);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gitData, setGitData] = useState([]);

    const search = (event) =>{
        event.preventDefault();
        setIsLoaded(false)
        fetch(`https://api.github.com/search/users?q=${searchValue}&page=1&per_page=50`)
            .then(res => res.json())
            .then(
                (data) => {
                    setIsLoaded(true);
                    setGitData(data.items);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }




    useEffect(() => {
        if (gitData.length && downPress) {
            setCursor(prevState =>
                prevState < gitData.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [downPress]);
    useEffect(() => {
        if (gitData.length && upPress) {
            setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);
    useEffect(() => {
        if (gitData.length && enterPress) {
            setSelected(gitData[cursor]);
            console.warn('enter!')
            window.open(gitData[cursor].html_url, '_blank', 'noopener,noreferrer')
        }
    }, [cursor, enterPress]);

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
                    return <tr className={`${i === cursor ? "selected" : ""}`}
                               >
                        <td>{i + 1}</td>
                        <td>{e.login}</td>
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