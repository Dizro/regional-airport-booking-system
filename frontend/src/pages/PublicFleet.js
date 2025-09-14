import React, { useEffect, useState } from 'react';
import aircraftService from '../services/aircraftService';

const PublicFleet = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    aircraftService.getAllAircrafts()
      .then(res => setAircrafts(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Наш парк воздушных судов</h1>
        
        {isLoading ? (
          <p className="text-center text-brand-gray">Загрузка данных...</p>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aircrafts.map(a => (
                <div key={a.aircraft_id} className="bg-gray-50 rounded-lg border p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-brand-dark">{a.model}</h2>
                  <p className="text-sm text-brand-gray mt-1">{a.aircraft_type}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex-grow flex flex-col justify-end">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-gray">Вместимость:</span>
                      <span className="font-semibold text-brand-dark">{a.capacity} чел.</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-brand-gray">Статус:</span>
                      <span className="font-semibold text-green-600 capitalize">{a.status === 'active' ? 'Активен' : a.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PublicFleet;