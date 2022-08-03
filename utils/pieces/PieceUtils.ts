import { PieceImageMap } from "../constants/PieceImages";

export const getPieceImgUrl = (type: string, color: string) => {
    return PieceImageMap[type][color];
}