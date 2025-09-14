import React from 'react';

const FlightTable = ({ flights, onSelect }) => {

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleString('ru-RU', options).replace(',', '');
  };

  const getStatusPill = (status) => {
    switch (status) {
        case 'По расписанию':
            return 'bg-blue-100 text-blue-800';
        case 'Задержан':
            return 'bg-yellow-100 text-yellow-800';
        case 'Отменен':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">№ Рейса</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Маршрут</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Вылет</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Прилет</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Тип ВС</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Статус</th>
            {onSelect && <th className="px-4 py-3"></th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flights.map((flight) => (
            <tr key={flight.flight_id}>
              <td className="px-4 py-4 whitespace-nowrap font-bold text-brand-dark">{flight.flight_number}</td>
              <td className="px-4 py-4 whitespace-nowrap text-brand-dark">
                {`${flight.departureAirport?.airport_name} (${flight.departureAirport?.airport_code}) → ${flight.arrivalAirport?.airport_name} (${flight.arrivalAirport?.airport_code})`}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-brand-dark">{formatDateTime(flight.scheduled_departure)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-brand-dark">{formatDateTime(flight.scheduled_arrival)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-brand-dark">{flight.Aircraft?.model || 'N/A'}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPill(flight.flight_status)}`}>
                  {flight.flight_status}
                </span>
              </td>
              {onSelect && (
                <td className="px-4 py-4 text-right">
                  <button 
                    onClick={() => onSelect(flight)} 
                    disabled={!flight.Aircraft}
                    title={!flight.Aircraft ? "На рейс не назначено ВС" : "Выбрать рейс"}
                    className="px-4 py-2 bg-brand-dark text-white text-sm rounded-lg hover:bg-black whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Выбрать
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;