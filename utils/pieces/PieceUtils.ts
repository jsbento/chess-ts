import { PieceImageMap } from "../constants/PieceImages";

export const getPieceImg = (type: string) => {
    return PieceImageMap[type];
}