import './Card.css'

const Card = ({image, value, suit, angle}) => {

    return (
        <div>
            <img 
                className="Card" 
                src={image} 
                alt={`Image of ${value} of ${suit}`}
                style={{transform : `rotate(${angle}deg)`}}
            />
        </div>
    )
}

export default Card;