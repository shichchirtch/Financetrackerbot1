const MONTHS = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
]


const monthNames = {'01':'Janury', '02':'February', '03':'March', '04':'April',
    '05':'May', '06':'Juny', '07':'July', '08':'August',
    '09':'September', '10':'Oktober', '11':'November', '12':'Dezember'}

export default function MonthsGrid({ onSelect }) {
    console.log('OnSELECT = ', onSelect)
    return (
        <div className="grid grid-cols-2 gap-3 mt-4 mb-4 place-items-center">
            {MONTHS.map(m => (
                <button
                    key={m}
                    onClick={() => onSelect(`2026-${m}`)}
                    className="bg-slate-500
                    rounded-lg
                    text-center text-slate-200 font-semibold text-xl
                    h-16 w-44
                    "
                >
                    {monthNames[m]}
                </button>
                )
            )}
        </div>
    )
}
