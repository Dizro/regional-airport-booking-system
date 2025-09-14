import React, { useEffect, useState } from 'react';
import flightService from '../services/flightService';
import airportService from '../services/airportService';
import FlightTable from '../components/FlightTable';

const PublicSchedule = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
      departureAirportId: '',
      arrivalAirportId: '',
      date: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [airportsRes, flightsRes] = await Promise.all([
          airportService.getAllAirports(),
          flightService.getAllFlights()
        ]);
        setAirports(airportsRes.data);
        setFlights(flightsRes.data);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (e) => {
      setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const onSearchSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      const activeFilters = {};
      if (filters.departureAirportId) activeFilters.departureAirportId = filters.departureAirportId;
      if (filters.arrivalAirportId) activeFilters.arrivalAirportId = filters.arrivalAirportId;
      if (filters.date) activeFilters.date = filters.date;

      try {
          const res = await flightService.getAllFlights(activeFilters);
          setFlights(res.data);
      } catch (err) {
          console.error("Ошибка поиска рейсов:", err);
          setFlights([]);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <>
      <div 
        className="relative bg-cover bg-center pt-8 pb-24" 
        style={{ backgroundImage: `url(/bg.png)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 container mx-auto px-6 text-white text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Онлайн-табло рейсов</h1>
            <p className="mt-4 text-lg text-gray-200">Найдите актуальную информацию о вылетах и прилетах</p>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-12 -mt-16 relative z-10">
        <form onSubmit={onSearchSubmit} className="bg-white p-6 rounded-lg shadow-lg border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Аэропорт вылета</label>
                    <select 
                        name="departureAirportId"
                        value={filters.departureAirportId}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border-brand-light-gray rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue text-brand-dark"
                    >
                        <option value="">Все</option>
                        {airports.map(ap => <option key={ap.airport_id} value={ap.airport_id}>{`${ap.airport_name} (${ap.airport_code})`}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Аэропорт прилета</label>
                    <select 
                        name="arrivalAirportId"
                        value={filters.arrivalAirportId}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border-brand-light-gray rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue text-brand-dark"
                    >
                        <option value="">Все</option>
                        {airports.map(ap => <option key={ap.airport_id} value={ap.airport_id}>{`${ap.airport_name} (${ap.airport_code})`}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Дата</label>
                    <input 
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border-brand-light-gray rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue text-brand-dark"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-brand-dark text-white font-semibold py-2 px-4 rounded-md hover:bg-black transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? 'Поиск...' : 'Найти рейсы'}
                </button>
            </div>
        </form>

        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            {isLoading ? (
                <div className="p-8 text-center text-brand-gray">Загрузка рейсов...</div>
            ) : flights.length > 0 ? (
                <FlightTable flights={flights} />
            ) : (
                <div className="p-8 text-center text-brand-gray">Рейсы по заданным критериям не найдены.</div>
            )}
        </div>
      </main>
    </>
  );
};

export default PublicSchedule;