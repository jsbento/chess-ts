import { NextPage } from "next";

const About: NextPage = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="my-10 w-3/5 overflow-y-scroll">
                <h1 className="text-center font-bold text-2xl">About Chess-TS</h1>
                <div className="mt-5 text-center">
                    <h2 className="text-center font-semibold text-xl">Libraries/Frameworks</h2>
                    <ul>
                        <li>NextJS</li>
                        <li>React</li>
                        <li>React-DND</li>
                        <li>Redux</li>
                        <li>chess.js</li>
                    </ul>
                </div>
                <div className="mt-5">
                    <h2 className="text-center font-semibold text-xl">The Board</h2>
                    <p>
                        The board for this version of the classic game is built with React. Drag-and-drop was achieved using
                        React-DND with the HTML5Backend. The pieces are PNG images, and their position is determined by the
                        backing chess.js package. In order to maintain playability when reversing the board, the index associated
                        with each piece stays the same from the first render throughout the game.
                    </p>
                </div>
                <div className="mt-5">
                    <h2 className="text-center font-semibold text-xl">Redux</h2>
                    <p>
                        Keeping track of the game state and other events/settings was pushed into Redux. The first version
                        of this project built from a react-dnd tutorial used RXJS, however I wanted practice using Redux and
                        felt it to be a much more manageble solution. Some components depend on states updated in other places
                        such as the move list rendered next to the board and when promotions are available - accessing these
                        from a central store for the whole made implementing those components much easier.
                    </p>
                </div>
                <div className="mt-5">
                    <h2 className="text-center font-semibold text-xl">The Engine</h2>
                    <p>
                        I decided to go with a simple negamax engine based on PeSTO (Piece-Square Table Only) evaluation.
                        Each piece is tied to set of a values for squares on the board; these values are essentially measures
                        of how good it is for that piece to stand there. The sum of that value across all pieces for a side
                        gives a square for that side. The difference of these scores is the position&apos;s evaluation score - this
                        is what negamax algorithm uses to find the &quot;best&quot; moves.
                    </p>
                </div>
                <div className="mt-5">
                    <h2 className="text-center font-semibold text-xl">Chess.js</h2>
                    <p>
                        The chess.js package is used to keep track of legal moves in a position, promotions, and the game&apos;s state. As
                        mentioned previously, this is the what the UI uses to display the board. Using this package eliminated the need
                        to manually do move validation, check handling, and game state checks. In turn, I was able to focus on the
                        engine aspect of things moreso then the nitty-gritty details of chess.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;