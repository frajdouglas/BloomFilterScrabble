
export const createSquareBoard = (size: number): (string | null)[][] => {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
    );
}