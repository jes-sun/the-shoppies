import React from "react";
import { debounce } from "debounce";
import confetti from "canvas-confetti";

import "./Search.css";
import logo_large from "./logo-large.png";
import logo_small from "./logo-small.png";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        if (this.state.currentNominations.length === 5) {
            document.getElementById("searchbar").value = ""
        }
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
        document.getElementById("searchbar").value = ""
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
        const OMDBurl = "https://omdbapi.com/?apikey=" + apikey + "&type=movie&page=1&s=" + this.state.currentSearch
        
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
        const OMDBurl = "https://omdbapi.com/?apikey=" + apikey + "&plot=full&i=" + this.state.currentSelection.imdbID
        
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
    renderSearchbar = () => {
        if (this.state.currentNominations.length !== 5) {
            return (
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
                        style={{
                            borderTopRightRadius:10,
                            borderBottomRightRadius:10
                        }}
                        onChange={debounce(this.onSearchChanged, 500)}
                    />
                </InputGroup>
            )
        } else {
            return (
                <InputGroup>
                    <InputGroup.Prepend id="searchbarprepend">
                        <InputGroup.Text id="basic-addon1">
                            And the Shoppie goes to... 
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl 
                        id="searchbar" 
                        type="search" 
                        value="these five movies!" 
                        disabled
                    />
                    <InputGroup.Append id="searchbarappend">
                        <InputGroup.Text id="finalnominationsection">
                            <button id="finalnominationbutton" onClick={this.triggerNominationsSubmitted}>
                                Nominate
                            </button>
                        </InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            )
        }
       
            
        
    }
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
                        {currentSelection.Rated}  <br/>                     
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
                        <a 
                            className="imdblink" 
                            href={"https://www.imdb.com/title/" + currentSelection.imdbID} 
                            rel="noreferrer" 
                            target="_blank"
                        >
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
                    <button className="removenominationbutton d-flex flex-column justify-content-around align-items-center" onClick={this.onNominationRemoved.bind(this, movie)}>
                        <Row>
                            <Col className="d-flex flex-column justify-content-start">
                                {this.getPoster(movie)}
                            </Col>
                        </Row>
                        <Row>
                            <Col id="nominationtitle" className="mx-auto my-auto">
                                {movie.Title}
                            </Col>
                        </Row>
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
                <img src={movie.Poster} alt={movie.Title} className="nominationposter align"></img>
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
        toast.info("You've chosen five movies!", {
            position: "top-center",
            hideProgressBar: true,
            closeButton: false
        })
    }

    triggerNominationsSubmitted = () => {
        //////////
        // Confetti code adapted from https://www.kirilv.com/canvas-confetti/
        //////////
        const end = Date.now() + (5 * 1000);
        var colors = ["#96bf48","#004c3f"];

        (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
        }());
        //////////
        const Thanks = (props) => (
            <div className="d-flex align-items-center justify-content-around">
                <img src={logo_small} alt="" height="50px"/>
                Thanks for your nominations!
            </div>
        )
        toast.dismiss();
        toast.info(<Thanks/>, {
            position: "top-center",
            closeButton: false,
            onClose: () => {
                localStorage.removeItem("nominations")
                window.location.reload()
            }
        })
    }
    
    render() {
        return (
            <>
            <Navbar className="justify-content-end">
                <Nav className="ml-4">
                    <strong className="navitem">Jessa Sundberg</strong>
                </Nav>
                <Nav className="ml-4">
                    <a 
                        className="navitem navlink" 
                        href="https://github.com/jes-sun" 
                        rel="noreferrer" 
                        target="_blank"
                    >
                        GitHub
                    </a>
                </Nav>
                <Nav className="ml-4">
                    <a 
                        className="navitem navlink" 
                        href="https://www.linkedin.com/in/jessun99/" 
                        rel="noreferrer" 
                        target="_blank"
                    >
                        LinkedIn
                    </a>
                </Nav>
            </Navbar>
            <Container>
                <Row>
                    <Col>
                    <ToastContainer/>
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
                                {this.renderSearchbar()}    
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
            </>
            )
    }
    
}
    
export default Search;
