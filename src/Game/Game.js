import React from 'react'
import wordsData from "../data.json"
import "./Game.scss"

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            //game
            start: false,
            isFinished: false,
            words: [],
            wordsIndex: 0,
            timer: 60,
            input: "",
            wordsSuccess: [],
            wordsFailed: [],

        }
        this.initializeGame = this.initializeGame.bind(this);
        this.ChangeInput = this.ChangeInput.bind(this);
        this.reloadGame = this.reloadGame.bind(this);
        this.CheckWord = this.CheckWord.bind(this);
        this.timer = null;
        this.chrono = null;
    }

    componentDidMount() {
        this.initializeGame()

        document.addEventListener('keyup', event => {
            if (event.code === 'Space') {
                if (this.state.start === false) {
                    return
                } else {
                    this.CheckWord()
                }
            }
        })
    }

    initializeGame() {
        let words = this.state.words
        for (let i = 0; i < 10; i++) {
            words = [...words, wordsData[Math.floor(Math.random() * wordsData.length)].toLowerCase()]
        }
        this.setState({ words: words, wordsIndex: 0, timer: 60, input: "", wordsSuccess: [], wordsFailed: [], isFinished: false, })
    }


    startGame() {
        console.log("starting game")
        this.setState({ start: true })
        this.timer = setTimeout(() => { this.endGame() }, 61000);
        this.chrono = setInterval(() => { this.decreaseTimer() }, 1000);
    }

    endGame() {
        clearInterval(this.chrono)
        this.setState({ isFinished: true })
        console.log("this is the end of the game")
    }

    decreaseTimer() {
        if (this.state.timer > 0) {
            this.setState({ timer: this.state.timer - 1 })
            console.log(this.state.timer)
        } else {
            return
        }
    }

    reloadGame() {
        this.setState({ start: false, words: [] }, () => {
            clearTimeout(this.timer);
            clearInterval(this.chrono);
            this.initializeGame();
            console.log("game reloaded")
        });

    }

    CheckWord() {
        console.log(this.state.words[this.state.wordsIndex])
        if (this.state.input.length > 0 && this.state.input === this.state.words[this.state.wordsIndex]) {
            console.log("le mot est bon")
            this.setState({
                //generate new word, add 1 to index to change word and put word in wordsSuccess array
                words: [...this.state.words, wordsData[Math.floor(Math.random() * wordsData.length)].toLowerCase()],
                wordsIndex: this.state.wordsIndex + 1,
                wordsSuccess: [...this.state.wordsSuccess, this.state.words[this.state.wordsIndex]],
                input: ""
            })
        } else if (this.state.input.length > 0 && this.state.input !== this.state.words[this.state.wordsIndex]) {
            console.log("le mot n'est pas bon")
            this.setState({
                //generate new word, add 1 to index to change word and put word in wordsSuccess array
                words: [...this.state.words, wordsData[Math.floor(Math.random() * wordsData.length)].toLowerCase()],
                wordsIndex: this.state.wordsIndex + 1,
                wordsFailed: [...this.state.wordsFailed, this.state.words[this.state.wordsIndex]],
                input: ""
            })
        } else {
            return
        }
    }

    ChangeInput(e) {
        if (this.state.input.length === 1 && this.state.wordsIndex === 0) {
            this.startGame();
        }
        console.log(e.target.value.split(" ").join(""))
        this.setState({ [e.target.name]: e.target.value.split(" ").join("") })
    }

    render() {
        return (
            <div onClick={() => { console.log(this.state) }} className="game__globalContainer">
                {!this.state.isFinished &&
                    <div className="words__globalContainer">
                        {this.state.words.length > 0 &&
                            <div className="words__container">{this.state.words.slice(0 + this.state.wordsIndex, 10 + this.state.wordsIndex).map((word, index) => (
                                <div key={index + word} className={"words__word"} style={{color: index === 0 && this.state.input.length > 0 ? this.state.input === word ? "green" : "red" : "auto"}}>{word}</div>
                            ))}</div>
                        }

                        <input name="input" value={this.state.input} onChange={this.ChangeInput} className="game__input"/>
                        <div>timer : {this.state.timer}</div>
                    </div>
                }
                {this.state.isFinished &&
                    <div className="results__container">
                        <p className="results__element">{this.state.wordsFailed.length + this.state.wordsSuccess.length} MPM</p>
                        <p className="results__element">{this.state.wordsFailed.length} wrong words</p>
                        <p className="results__element">{this.state.wordsSuccess.length} right words</p>
                    </div>
                }
                <button onClick={() => { this.reloadGame() }} className="game__reloadButton">Reload game</button>
            </div>
        )
    }
}

export default Game