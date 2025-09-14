import React from 'react';

const Seat = ({ status = 'available', label, onSelect }) => {
    const baseClasses = "w-8 h-8 flex items-center justify-center rounded-md cursor-pointer border text-sm font-mono";
    
    let statusClasses = '';
    switch (status) {
        case 'selected':
            statusClasses = 'bg-gray-800 text-white border-gray-800';
            break;
        case 'occupied':
            statusClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400';
            break;
        case 'available':
        default:
            statusClasses = 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100';
            break;
    }

    const handleClick = () => {
        if (status !== 'occupied' && onSelect) {
            onSelect(label);
        }
    };
    
    return (
        <div className={`${baseClasses} ${statusClasses}`} onClick={handleClick}>
            {label}
        </div>
    );
};


const SeatSelector = ({ aircraft, onSeatSelect, selectedSeat, currentBookingSeats = [], flightBookedSeats = [] }) => {
    const generateLayout = () => {
        if (!aircraft || !aircraft.capacity) return [];
        const rows = Math.ceil(aircraft.capacity / 4);
        const layout = [];

        for (let i = 1; i <= rows; i++) {
            layout.push(`${i}A`, `${i}B`, null, `${i}C`, `${i}D`);
        }
        return layout;
    };

    const layout = generateLayout();

    return (
        <div>
            <h4 className="font-semibold mb-2">Схема салона</h4>
            <div className="p-4 bg-gray-50 rounded-md border">
                <div className="grid grid-cols-5 gap-2 w-fit mx-auto">
                    {layout.map((seatLabel, index) => {
                        if (seatLabel === null) {
                            return <div key={index} className="w-8 h-8"></div>;
                        }

                        let status = 'available';
                        if (flightBookedSeats.includes(seatLabel) || (currentBookingSeats.includes(seatLabel) && selectedSeat !== seatLabel)) {
                            status = 'occupied';
                        } else if (selectedSeat === seatLabel) {
                            status = 'selected';
                        }
                        
                        return <Seat key={seatLabel} label={seatLabel} status={status} onSelect={onSeatSelect} />;
                    })}
                </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center"><div className="w-4 h-4 rounded bg-white border border-gray-400 mr-2"></div>Свободно</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded bg-gray-800 mr-2"></div>Выбрано</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded bg-gray-300 border border-gray-400 mr-2"></div>Занято</div>
            </div>
        </div>
    );
};

export default SeatSelector;