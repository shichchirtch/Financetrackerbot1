import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export default function SortableCategoryButton({category}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: category,
    });

    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
};

    return (

        <button

            ref={setNodeRef}

            style={style}

            {...attributes}
            {...listeners}

            className="
                h-16
                rounded-xl
                text-sm
                font-medium
                bg-gradient-to-br
                from-[#7489a3]
                to-[#2F3D45]
                shadow-md
                cursor-grab
                active:cursor-grabbing
                active:scale-95
                select-none
                transition
            "
        >
            {category}
        </button>
    );
}