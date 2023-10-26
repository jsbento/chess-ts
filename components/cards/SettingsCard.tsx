import React, { ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../types/state/AppState'
import * as Actions from '../../state/actions/SettingsState'

const SettingsCard: React.FC = () => {
  const dispatch = useDispatch()

  const {
    playerWhite,
    useAI,
    engineDepth,
    moveTime,
  } = useSelector(( state: AppState ) => state.settings )

  const onChangePlayerWhite = () => {
    dispatch( Actions.setPlayerWhite( !playerWhite ))
  }

  const onChangeUseAI = () => {
    dispatch( Actions.setUseAI( !useAI ))
  }

  const onChangeEngineDepth = ( e: ChangeEvent<HTMLInputElement> ) => {
    dispatch( Actions.setEngineDepth( parseInt( e.target.value )))
  }

  const onChangeMoveTime = ( e: ChangeEvent<HTMLInputElement> ) => {
    dispatch( Actions.setMoveTime( parseInt( e.target.value )))
  }

  return (
    <div className="w-[250px] h-[500px] border border-1 border-black items-center text-center rounded-lg bg-gray-50">
      <h1 className="font-semibold bg-gray-300 rounded-t-md py-1">Settings</h1>
      <div className="flex items-center justify-center mt-3">
        <p className="font-semibold">
          Playing as:
        </p>
        <button className="rounded border px-1 ml-3 mt-1 bg-gray-300 font-semibold"
          onClick={onChangePlayerWhite}
        >
          {playerWhite ? 'White' : 'Black'}
        </button>
      </div>
      <div className="flex items-center justify-center mt-3">
        <p className="font-semibold">
          Use AI:
        </p>
        <input
          type="checkbox"
          className="ml-3 mt-1"
          checked={useAI}
          onChange={onChangeUseAI}
        />
      </div>
      <div className="flex items-center justify-center mt-3">
        <p className="font-semibold">
          Engine depth:
        </p>
        <input
          className="ml-3 mt-1 w-12 px-1 border-2 border-black rounded-md"
          type="number"
          value={engineDepth}
          onChange={onChangeEngineDepth}
        />
      </div>
      <div className="flex items-center justify-center mt-3">
        <p className='font-semibold'>
          Move time (ms):
        </p>
        <input
          className='ml-3 mt-1 w-[33%] px-1 border-2 border-black rounded-md'
          type='number'
          value={moveTime}
          onChange={onChangeMoveTime}
          step={100}
        />
      </div>
    </div>
  )
}

export default SettingsCard