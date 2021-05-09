import React from "react";
import { debounce } from "debounce";

import "./Search.css";
import logo_large from "./logo-large.png";
import logo_small from "./logo-small.png";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Toast from "react-bootstrap/Toast";
import ToastHeader from "react-bootstrap/ToastHeader";
import ToastBody from "react-bootstrap/ToastBody";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl"

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
            this.triggerMaxNominations()
        } else {
            document.getElementById("clearnominations").disabled = (this.state.currentNominations.length === 0)
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
        document.getElementById("searchbar").focus();
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
                        <Col xs={4} md={7}>
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
        }
    }
    
    renderSelection = () => {
        if (this.state.currentSelection) {
            const currentSelection = this.state.currentSelection
            return(
                <>
                <Row>
                    <Col className="mb-2">
                        <h4 id="selectionttitle">
                            {currentSelection.Title} ({currentSelection.Year}) <br/> 
                        </h4>                       
                        <em id="selectiongenre">{currentSelection.Genre}</em> <br/>                        
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} lg="auto">
                        <div style={{width:"fit-content", margin:"auto"}}>
                            {this.getPoster(currentSelection)}
                        </div>
                        <hr/>
                        <a className="imdblink" href={"https://www.imdb.com/title/" + currentSelection.imdbID} rel="noreferrer" target="_blank">
                            <h6 className="imdblink">
                                IMDB ➔
                            </h6>
                        </a>
                    </Col>
                    <Col>
                        {currentSelection.Plot}
                    </Col>
                </Row>
                </>
            )
        }
    }
    renderNominations = () => {
        let nominationsCols = []
        if (this.state.currentNominations.length > 0) {
            nominationsCols = this.state.currentNominations.map(movie => (
                <Col className="d-flex justify-content-center my-3" xs={5} sm={3} lg={2} key={movie.imdbID}>
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

    triggerMaxNominations = () => {
        
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Row className="mt-3">
                            <Col className="d-flex align-items-center">
                            <img src={logo_large} alt="The Shoppies" height="200em" className="mx-auto d-block"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                            <h3>
                                Movie awards for entrepreneurs
                            </h3>
                            </Col>
                        </Row>
                        <Row id="topsection">
                            <Col id="nominations" className="py-2">
                                <Row>
                                    <Col id="instructions" className="d-flex align-items-center justify-content-center">
                                        <span className="text-center">
                                            Who should win the Shoppie for Best Movie? Nominate five of your top picks using the search bar below.
                                        </span>
                                    </Col>
                                    <Col className="d-flex align-items-center" md="auto">
                                        <button className="mx-auto mt-2" id="clearnominations" onClick={this.onNominationsCleared} style={{margin:"auto"}}>
                                            Clear
                                        </button>
                                    </Col>
                                </Row>
                                <Row className="justify-content-center">
                                    {this.renderNominations()}
                                </Row>
                            </Col>
                        </Row>
                        
                        <Row id="midsection">
                            <Col className="py-2">
                                <InputGroup>
                                        <InputGroup.Prepend id="searchbarprepend">
                                            <InputGroup.Text id="basic-addon1">
                                                And the Shoppie goes to... 
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    <FormControl 
                                        id="searchbar" 
                                        type="search" 
                                        placeholder="the best movie I've ever seen" 
                                        onChange={debounce(this.onSearchChanged, 500)}
                                    />
                                </InputGroup>
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
