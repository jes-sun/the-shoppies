import React from "react";
import { debounce } from "debounce";

import "./Search.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {currentSearch: "", currentResults: {}, currentSelection: {}, currentNominations: []}
    }

    // onChanged funcs
    onNominationAdded = (movie) => {
        const newNominations = this.state.currentNominations.concat(movie)
        this.setState({currentNominations:newNominations})
    }
    onNominationRemoved = (movie) => {
        const newNominations = this.state.currentNominations.filter((item) => {
            return item.imdbID !== movie.imdbID
        })
        this.setState({currentNominations:newNominations})
    }
    onNominationsChanged() {
        localStorage.setItem("nominations", JSON.stringify(this.state.currentNominations))
        if (this.state.currentNominations.length === 5) {
            this.toggleMaxNominations(1)
        } else {
            this.toggleMaxNominations(0)

            // if (this.state.currentNominations.length > 0) {
            //     this.toggleInstructions(0)
            // } else {
            //     this.toggleInstructions(1)
            // }
        } 
    }
    onNominationsCleared = () => {
        this.setState({currentNominations:[]})
    }
    onSearchChanged = (event) => {
        this.setState({currentSearch:event.target.value})
        this.onSelectionCleared()
    }
    onSelectionChanged = (movie) => {
        if (movie.imdbID !== this.state.currentSelection.imdbID) {
            this.setState({currentSelection:movie})
        }
        
    }
    onSelectionCleared() {
        this.setState({currentSelection:{}})
        this.toggleSelectionDetails()
    }

    // data funcs
    searchCache = () => {
        return localStorage.getItem(this.state.currentSearch)
    }
    searchOMDB = () => {
        const apikey = process.env.REACT_APP_API_KEY
        const OMDBurl = "http://omdbapi.com/?apikey=" + apikey + "&type=movie&page=1&s=" + this.state.currentSearch
        
        if (this.searchCache()) {
            this.setState({currentResults:JSON.parse(this.searchCache())})
        } else if (this.state.currentSearch === "") {
            localStorage.setItem("", JSON.stringify({}))
        } else {
            fetch(OMDBurl)
            .then((response) => response.json())
            .then((data) => {
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
        const OMDBurl = "http://omdbapi.com/?apikey=" + apikey + "&plot=full&i=" + this.state.currentSelection.imdbID
        
        if (this.selectionCache()) {
            this.setState({currentSelection:JSON.parse(this.selectionCache())})
        } else {
            console.log(OMDBurl)
            fetch(OMDBurl)
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem(this.state.currentSelection.imdbID, JSON.stringify(data))
                this.setState({currentSelection:data})
            });
        }
    }
    
    // component funcs
    componentDidMount() {
        if (localStorage.getItem("nominations")) {
            this.setState({currentNominations:JSON.parse(localStorage.getItem("nominations"))})
        }
        this.toggleSelectionDetails(0)
        //this.toggleInstructions(1)   
        this.toggleMaxNominations(0)
    }
    componentDidUpdate(prevProps, prevState) {
        this.checkNominationButtons()

        if (this.state.currentSearch !== prevState.currentSearch) {
            this.searchOMDB()
        } else if (this.state.currentSelection.imdbID !== prevState.currentSelection.imdbID) {
            this.selectionDetails()
            this.toggleSelectionDetails(1)
        } else if (this.state.currentNominations !== prevState.currentNominations) {  
            this.onNominationsChanged()
        }
    }

    // show/hide enable/disable sections
    toggleSelectionDetails(t) {
        if (t) {
            document.getElementById("selectiondetails").style.visibility = "visible"
        } else {
            document.getElementById("selectiondetails").style.visibility = "hidden"
        }
        
    }
    toggleInstructions(t) {
        if (t) {
            document.getElementById("instructions").style.display = "block"
        } else {
            document.getElementById("instructions").style.display = "none"
        }
        
    }
    toggleMaxNominations(t) {
        // TODO
    }
    checkNominationButtons() {
        const nominationButtons = document.getElementsByClassName("addnominationbutton")
        if (this.state.currentNominations.length === 5) {
            for (let button of nominationButtons) {
                button.disabled = true
            }
        } else {
            const currentNominationsIds = this.state.currentNominations.map(movie => movie.imdbID)
            for (let button of nominationButtons) {
                button.disabled = currentNominationsIds.includes(button.dataset.imdbid)
            }
        }
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
                    <Row key={movie.imdbID} className="searchresult my-2 align-items-center"> 
                        <Col>
                            <h6>
                                {movie.Title} ({movie.Year})
                            </h6>
                        </Col>
                        <Col id="searchresultbuttons">
                            <button data-imdbid={movie.imdbID} className="addnominationbutton" onClick={this.onNominationAdded.bind(this, movie)}>
                                Nominate
                            </button>
                            <button className="selectiondetailsbutton" onClick={this.onSelectionChanged.bind(this, movie)}>
                                More info
                            </button>
                        </Col>
                    </Row>
                ))
            } else {
                return(
                    <span className="noresults">
                        No results found!
                    </span>
                )
            }
        } else {
            return(
                <span className="noresults">
                    Type something in the search bar!
                </span>
            )
        }
    }
    
    renderSelection = () => {
        if (this.state.currentSelection) {
            const currentSelection = this.state.currentSelection
            return(
                <Row>
                    <Col>
                        <h4 id="selectionttitle">
                            {currentSelection.Title} ({currentSelection.Year}) <br/> 
                        </h4>                       
                        <em id="selectiongenre">{currentSelection.Genre}</em> <br/>                        
                        <p id="selectionplot">
                            {currentSelection.Plot}
                        </p>
                        <a id="imdblink" href={"https://www.imdb.com/title/" + currentSelection.imdbID} rel="external">
                            <h6>
                                IMDB ➔
                            </h6>
                        </a>
                    </Col>
                </Row>
            )
        }
    }
    renderNominations = () => {
        let nominationsCols = []
        if (this.state.currentNominations.length > 0) {
            nominationsCols = this.state.currentNominations.map(movie => (
                <Col className="d-flex justify-content-center my-3" key={movie.imdbID}>
                    <button className="removenominationbutton" onClick={this.onNominationRemoved.bind(this, movie)}>
                        {this.getPoster(movie)}
                        <h6 id="nominationtitle">
                            {movie.Title}
                        </h6>
                    </button>
                </Col>   
                ))
        }

        while (nominationsCols.length < 5) {
            nominationsCols.push((<Col key={"empty"+nominationsCols.length}></Col>))
        }

        return nominationsCols
    }
    getPoster(movie) {
        if (movie.Poster !== "N/A") {
            return (
                <img src={movie.Poster} alt={movie.Title} className="nominationposter"></img>
            )
        } else {
            return (
                <div className="posterplaceholder d-flex align-items-center" style={{margin:"auto"}}>
                    <span style={{margin:"auto"}}>
                        No poster image
                    </span>
                </div>
            )
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Row id="title" className=" mt-3 justify-content-center">
                            <h1>The Shoppies</h1>
                        </Row>
                        
                        <Row id="topsection">
                            <Col id="nominations" className="py-2">
                                <Row>
                                    <Col id="instructions" className="pb-2 mb-2 text-center">
                                        <span>
                                        Who will win the Shoppie for Best Movie? Nominate five of your favourite movies using the search bar below.
                                        </span>
                                    </Col>
                                    <Col xs={2} lg={1} >
                                        <button id="clearnominations" onClick={this.onNominationsCleared}>
                                            Clear
                                        </button>
                                    </Col>
                                </Row>
                                <Row className="nominationslist">
                                    {this.renderNominations()}
                                </Row>
                            </Col>
                        </Row>
                        
                        <Row id="midsection">
                            <Col className="py-2">
                                <input id="searchbar" type="search" placeholder="Search for a movie..." onChange={debounce(this.onSearchChanged, 500)}/>
                            </Col>
                            
                        </Row>
                    </Col>
                </Row>
                <Row className="my-2 py-2" id="bottomsection">
                    <Col id="results">
                        {this.renderResults()}
                    </Col>
                    <Col id="selectiondetails">
                        {this.renderSelection()}
                    </Col>
                </Row>
                
            </Container>
            )
    }
    
}
    
export default Search;
