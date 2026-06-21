import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export default function CategoryButton({
    category,
    onClick
}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: category
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
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
                hover:bg-[#6f8095]
                active:scale-95
                transition
                shadow-md
            "

            onClick={onClick}

        >
            {category}

        </button>

    );

}