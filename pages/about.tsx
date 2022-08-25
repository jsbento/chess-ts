import { NextPage } from "next";

const About: NextPage = () => {
    return (
        <div>
            <h1>About Chess-TS</h1>
            <div>
                <h2>Libraries/Frameworks</h2>
                <ul>
                    <li>NextJS</li>
                    <li>React</li>
                    <li>React-DND</li>
                    <li>Redux</li>
                    <li>chess.js</li>
                </ul>
            </div>
            <div>
                <h2>The Board</h2>
                <p>
                    The board for this version of the classic game is built with React. Drag-and-drop was achieved using
                    React-DND with the HTML5Backend. The pieces are PNG images, and their position is determined by the
                    backing chess.js library. In order to maintain playability, the index associated with each piece stays
                    the same from the first render through the game.
                </p>
            </div>
            <div>
                <h2>Redux</h2>
                <p>
                    Keeping track of the game state and other events/settings was pushed into Redux. The first version
                    of this project built from a react-dnd tutorial used RXJS, however I wanted practice using Redux and
                    felt it to be a much more manageble solution. Some components depend on states updated in other places
                    such as the move list rendered next to the board and when promotions are available - accessing these
                    from a central store for the whole made implementing those components much easier.
                </p>
            </div>
            <div>
                <h2>The Engine</h2>
                <p>
                    I decided to go with a simple-ish minimax engine based on PeSTO (Piece-Square Table Only) evaluation.
                    Each piece is tied to set of a values for squares on the board; these values are essentially measures
                    of how good it is for that piece to stand there. The sum of that value across all pieces for a side
                    gives a square for that side. The difference of these scores is the position's evaluation score - this
                    is what minimax algorithm uses to make its decisions.
                </p>
            </div>
        </div>
    );
}

export default About;