import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableTileProps {
    tile: string;
    index: number;
    playerId: number;
}

export const DraggableTile = ({ tile, index, playerId }: DraggableTileProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `tile-${playerId}-${index}`, // Unique ID for each tile
        data: {
            letter: tile,
            playerOwnerId: playerId,
            originalIndex: index,
            type: 'tile'
        }
    });

    // Transform handles the visual movement during drag
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}           // Connects this element to DND Kit
            style={style}              // Applies drag transform
            {...listeners}             // Enables drag events (mousedown, touchstart)
            {...attributes}            // Accessibility attributes
  className="aspect-square w-10 border-box border flex items-center justify-center bg-[#ffe6a8]"
        >
            {tile}
        </div>
    );
};