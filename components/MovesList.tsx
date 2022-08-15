import React, { useState } from "react";
import { useSelector } from "react-redux";

const MovesList: React.FC = () => {
    const moves = useSelector((state: any) => state.moves);

    const makeRows = () => {
        const rows = [];
        let movesNum = 1;
        for (let i = 0; i < moves.length; i += 2) {
            rows.push({movesNum, wMove: moves[i], bMove: moves[i + 1] ? moves[i + 1] : null});
            movesNum++;
        }

        return (
            <tbody className="w-[100%]">
                {rows.map((row, index) => (
                    <tr className="w-[100%] font-semibold" key={index}>
                        <td className="w-1/3">{row.movesNum}</td>
                        <td className="w-1/3">{row.wMove}</td>
                        <td className="w-1/3">{row.bMove ? row.bMove : ""}</td>
                    </tr>
                ))}
            </tbody>
        );
    }

    return (
        <div className="w-[300px] h-[450px] overflow-auto">
            <table className="w-full border-collapse">
                <thead className="w-[100%] text-left sticky top-0 bg-slate-400">
                    <tr className="w-[100%]">
                        <th className="w-1/3 sticky top-0 z-[1]">Move</th>
                        <th className="w-1/3 sticky top-0 z-[1]">White</th>
                        <th className="w-1/3 sticky top-0 z-[1]">Black</th>
                    </tr>
                </thead>
                {makeRows()}
            </table>
        </div>
    );
}

export default MovesList;