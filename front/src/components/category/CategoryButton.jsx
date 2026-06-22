import {useRef} from "react";

export default function CategoryButton({
                                           category,
                                           onClick,
                                           setDragMode
                                       }) {

    function handleClick() {

        onClick();

    }

    return (

        <button

            onClick={handleClick}

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
        >
            {category}
        </button>

    );

}