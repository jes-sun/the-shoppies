import React from "react";

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {currentSearch: "", currentResults: {}, currentSelection: {}, currentNominations: []}
    }

    // onChanged funcs
    onNominationsChanged = (event) => {
        const newNominations = this.state.currentNominations.concat(event.target.value)
        this.setState({currentNominations:newNominations})
    }
    onSearchChanged = (event) => {
        this.setState({currentSearch:event.target.value})
    }
    onSelectionChanged = (movie) => {
        this.setState({currentSelection:movie})
    }

    // data funcs
    searchCache = () => {
        return localStorage.getItem(this.state.currentSearch)
    }
    searchOMDB = () => {
        const apikey = process.env.REACT_APP_API_KEY
        const OMDBurl = "http://omdbapi.com/?apikey=" + apikey + "&type=movie&page=1&s=" + this.state.currentSearch
        
        if (this.searchCache()) {
            console.log("retrieved from cache")
            this.setState({currentResults:JSON.parse(this.searchCache())})
        } else if (this.state.currentSearch === "") {
            localStorage.setItem("", JSON.stringify({}))
        } else {
            console.log(OMDBurl)
            fetch(OMDBurl)
            .then((response) => response.json())
            .then((data) => {
                console.log("data",data)
                localStorage.setItem(this.state.currentSearch, JSON.stringify(data))
                this.setState({currentResults:data})
            });
        }
    }
    selectionCache = () => {
        return localStorage.getItem(this.state.currentSelection.imdbID)
    }
    selectionDetails = () => {
        const apikey = process.env.REACT_APP_API_KEY
        const OMDBurl = "http://omdbapi.com/?apikey=" + apikey + "&i=" + this.state.currentSelection.imdbID
        
        if (this.selectionCache()) {
            console.log("retrieved from cache")
            this.setState({currentSelection:JSON.parse(this.selectionCache())})
        } else {
            console.log(OMDBurl)
            fetch(OMDBurl)
            .then((response) => response.json())
            .then((data) => {
                console.log("data",data)
                localStorage.setItem(this.state.currentSelection.imdbID, JSON.stringify(data))
                this.setState({currentSelection:data})
            });
        }
    }
    
    // component funcs
    componentDidMount() {
        this.searchOMDB()
        document.getElementById("selectiondetails").style.display = "none"     
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentSearch !== prevState.currentSearch) {
            this.searchOMDB()
            console.log(this.state)
        }
        if (this.state.currentSelection.imdbID !== prevState.currentSelection.imdbID) {
            this.selectionDetails()
            this.showSelectionDetails()
        }
    }

    // show/hide sections
    showSelectionDetails() {
        document.getElementById("selectiondetails").style.display = "block"
    }
    showNominations() {

    }

    // additional rendering
    renderResults = () => {
        if (this.state.currentResults.Response) {
            if (this.state.currentResults.Response === "True") {
                const searchResults = this.state.currentResults.Search
                const uniqueSearchResults = searchResults.filter((item, index) => {
                    const resultsByID = searchResults.map(result => result.imdbID)
                    return resultsByID.indexOf(item.imdbID) === index
                })
                return uniqueSearchResults.map(movie => (
                    <li key={movie.imdbID} className="searchResult"> 
                        <p>
                            {movie.Title} ({movie.Year})
                        </p>
                        <p id="searchresultbuttons">
                            <button className="searchresultbutton" id="selectiondetailsbutton" onClick={this.onSelectionChanged.bind(this, movie)}>
                                More info
                            </button>
                            <button className="searchresultbutton" id="nominatebutton">
                                Nominate
                            </button>
                        </p>

                    </li>
                ))
            } else {
                return(
                    <li className="noresults">
                        No results found!
                    </li>
                )
            }
        } else {
            return(
                <li className="noresults">
                    Type something in the search bar!
                </li>
            )
        }
    }
    renderSelection = () => {
        if (this.state.currentSelection) {
            const currentSelection = this.state.currentSelection
            return(
                <>
                <h2 id="selectionttitle">
                    {currentSelection.Title} ({currentSelection.Year})
                </h2>
                <em id="selectiongenre">{currentSelection.Genre}</em>
                <p id="selectionplot">
                    {currentSelection.Plot}
                </p>
                </>
            )
        }
    }

    render() {
        return (
            <main>
                <div id="title">
                    <h1>The Shoppies</h1>
                </div>
                <div id="topsection">
                    <div id="nominations">
                        <h4 id="nominationstitle">
                            Nominations
                        </h4>
                    </div>
                    <div id="help">
                        <p id="instructions">
                            <h4 id="intro">
                                Who will win the award for Best Movie?
                            </h4>
                            Nominate five of your favourite movies using the search bar below.
                        </p>
                    </div>

                </div>
                <div id="search">
                    <input id="searchbar" type="search" placeholder="Search for a movie..." onChange={this.onSearchChanged}/>
                </div>
                <div className="results">
                    <span id="resultslisttitle">
                        Search Results
                    </span>
                    <ul id="resultslist">
                        {this.renderResults()}
                    </ul>
                </div>
                <div id="selectiondetails">
                    {this.renderSelection()}
                </div>
            </main>
            )
    }
    
}
    
export default Search;
