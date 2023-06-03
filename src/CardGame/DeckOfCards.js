import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const DeckOfCards = () => {
    const BASE_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    const CARD_URL = 'https://deckofcardsapi.com/api/deck'
    // used for setting deck id
    const [ deckId, setDeckId ] = useState();
    // used for keeping track of the number of cards drawn from the deck
    const [ cardNum, setCardNum ] = useState(0);
    // an array of card data that it used to display cards
    const [ deck, setDeck ] = useState([]);
    // used to control "start"/"stop" game buttons display
    const [drawingCards, setDrawingCards] = useState(false);
    // used to control stopping/starting drawing more cards with help of 
    // useEffect which looks for changes in numOfDraws state to activate
    const [numOfDraws, setNumOfDraws] = useState(0);
    // used to display Reset game button instead of start drawing/stop drawing buttons
    const [drawNewDeck, setDrawNewDeck ] = useState(false);
    // used to control setInterval function
    const timerId = useRef();

    /*  - makes an API call and then sets deckId which can be used to draw
         more cards from the same deck,
        - Keeps track of changes in deckId state
        - activates at the first render, and when game reset button changes the
          state of deckId
    */
    useEffect(() => {
        async function getDeckId() {
            const res = await axios.get(BASE_URL)
            setDeckId(res.data.deck_id)
        }
        getDeckId();
    }, [deckId])

    /* - function that is activated by the "Start Drawing" button
       - setDrawingCards changes state which now displays "Stop Drawing" button
       - setNumOfDraws is used for controlling the state of starting and 
         pausing game
    */
    const drawCard = () => {
        setDrawingCards(true)
        setNumOfDraws(draw=> draw +1)
    }

    // stops drawing of the cards, activated by "Stop Drawing" button
    const stopDrawingCards = () => {
        setDrawingCards(false)
        clearInterval(timerId.current)
    }

    /* - if there is a deckId then start an interval of making API calls
         to draw new card from the same deckId.
       - then adds new card to deck array which is used to display all cards
       - keeps track of numOfDraws state for starting/pausing drawing of new card
    */
    useEffect(() => {
        if (deckId) {
            timerId.current = setInterval(() => {
                async function getCard() {
                    setCardNum(card => card + 1)
                    const res = await axios.get(`${CARD_URL}/${deckId}/draw?count=1`)
                    const cardData = res.data.cards[0]
                    setDeck(deck => ([
                        ...deck, {
                        code: cardData.code,
                        image: cardData.image,
                        value: cardData.value,
                        suit: cardData.suit,
                        angle: Math.floor(Math.random() * 110)
                        }
                    ]))
                }
                getCard();
           },1000)
        }
    }, [numOfDraws])

    /*  - keeps track of cardNum state and then checks if cardNum is equal
          to 52 at which point setInterval for drawing cards is stopped and
          button for "Reset Game" is displayed
    */
    useEffect(() => {
        if (cardNum === 52) {
            clearInterval(timerId.current)
            setDrawNewDeck(true)
            alert('No more cards remaining')
        }
    },[cardNum])

    // resets game when "Rest Game" button is pressed
    const resetGame = () => {
        setDrawNewDeck(false)
        setDeckId('')
        setDeck([])
        setCardNum(1)
        setDrawingCards(false)
        setNumOfDraws(0)
    }


    return (
        <div>{ drawNewDeck ?
                <button onClick={resetGame}>Reset Game</button>
                :          
            (drawingCards ? 
                <button onClick={stopDrawingCards}>Stop drawing</button> :
                <button onClick={drawCard}>Start drawing</button>
            )
            }
            {deck.map(({code, image, value, suit, angle}) => 
                <Card 
                    key={code} 
                    image={image} 
                    value={value} 
                    suit={suit}
                    angle={angle}
                />
            )}
        </div>
    )
}

export default DeckOfCards;