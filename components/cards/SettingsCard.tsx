import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../types/state/AppState";
import * as Actions from "../../state/actions/SettingsState";

const SettingsCard: React.FC = () => {
    const dispatch = useDispatch();

    const playerWhite = useSelector((state: AppState) => state.settings.playerWhite);

    const _updatePlayerWhite = useCallback((playerWhite: boolean) => dispatch(Actions.setPlayerWhite(playerWhite)), [dispatch]);

    return (
        <div className="w-[200px] h-[500px] border border-1 border-black items-center text-center">
            <h1 className="font-semibold bg-slate-400">Settings</h1>
            <div className="flex items-center justify-center mt-3">
                <p className="font-semibold">
                    Playing as:
                </p>
                <button className="rounded border px-1 ml-3 bg-slate-300 font-semibold"
                    onClick={() => _updatePlayerWhite(!playerWhite)}
                >
                    {playerWhite ? "White" : "Black"}
                </button>
            </div>
        </div>
    );
}

export default SettingsCard;