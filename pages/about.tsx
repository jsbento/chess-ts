import { NextPage } from 'next'

const About: NextPage = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='my-10 w-3/5 overflow-y-scroll'>
        <h1 className='text-center font-bold text-2xl'>About Chess-TS</h1>
        <div className='mt-5 text-center'>
          <h2 className='text-center font-semibold text-xl'>Libraries/Frameworks</h2>
          <ul>
            <li>NextJS</li>
            <li>React</li>
            <li>React-DND</li>
            <li>Redux</li>
            <li>chess.js</li>
            <li>Golang</li>
            <li>MongoDB</li>
          </ul>
        </div>
        <div className='mt-5'>
          <h2 className='text-center font-semibold text-xl'>The Board</h2>
          <p>
            The board for this version of the classic game is built with React. Drag-and-drop was achieved using
            React-DND with the HTML5Backend. The pieces are PNG images, and their position is determined by the
            backing chess.js package. In order to maintain playability when reversing the board, the index associated
            with each piece stays the same from the first render throughout the game.
          </p>
        </div>
        <div className='mt-5'>
          <h2 className='text-center font-semibold text-xl'>The Engine</h2>
          <p>The engine is a Golang port of Bluefever Software&apos;s C Chess engine.
            Check out his YouTube channel {' '}
            <a
              target='_blank'
              rel='noreferrer noopener'
              href='https://www.youtube.com/@BlueFeverSoft'
              className='text-blue-500 hover:underline'
            >
              here
            </a>, or explore the engine series {' '}
            <a
              target='_blank'
              rel='noreferrer noopener'
              href='https://www.youtube.com/watch?v=bGAfaepBco4&list=PLZ1QII7yudbc-Ky058TEaOstZHVbT-2hg&pp=iAQB'
              className='text-blue-500 hover:underline'
            >
              here
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About