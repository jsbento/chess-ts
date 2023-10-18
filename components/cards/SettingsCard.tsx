import React, { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { AppState } from "../../types/state/AppState"
import * as Actions from "../../state/actions/SettingsState"

const SettingsCard: React.FC = () => {
    const dispatch = useDispatch()

    const { playerWhite, useAI, engineDepth } = useSelector(( state: AppState ) => state.settings )

    const _updatePlayerWhite = useCallback(( playerWhite: boolean ) => dispatch( Actions.setPlayerWhite( playerWhite )), [ dispatch ])
    const _updateUseAI = useCallback(( useAI: boolean ) => dispatch( Actions.setUseAI( useAI )), [ dispatch ])
    const _setEngineDepth = useCallback(( engineDepth: number ) => dispatch( Actions.setEngineDepth( engineDepth )), [ dispatch ])

    return (
        <div className="w-[200px] h-[500px] border border-1 border-black items-center text-center">
            <h1 className="font-semibold bg-slate-400">Settings</h1>
            <div className="flex items-center justify-center mt-3">
                <p className="font-semibold">
                    Playing as:
                </p>
                <button className="rounded border px-1 ml-3 mt-1 bg-slate-300 font-semibold"
                    onClick={() => _updatePlayerWhite( !playerWhite )}
                >
                    {playerWhite ? "White" : "Black"}
                </button>
            </div>
            <div className="flex items-center justify-center mt-3">
                <p className="font-semibold">
                    Use AI:
                </p>
                <input type="checkbox" className="ml-3 mt-1" checked={useAI} onChange={() => _updateUseAI( !useAI )}/>
            </div>
            <div className="flex items-center justify-center mt-3">
                <p className="font-semibold">
                    Engine depth:
                </p>
                <input className="ml-3 mt-1 w-10"
                    type="number"
                    value={engineDepth}
                    onChange={ e => _setEngineDepth( parseInt( e.target.value ))}
                />
            </div>
        </div>
    )
}

export default SettingsCard