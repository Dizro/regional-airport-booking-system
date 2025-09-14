import React from 'react';

const PublicContacts = () => {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">Контакты и бронирование</h1>
        
        <div className="border-l-4 border-brand-blue bg-brand-blue-light text-brand-dark p-6 rounded-r-lg mb-8">
          <h2 className="text-2xl font-bold mb-2">Бронирование билетов</h2>
          <p className="mb-4">
            Для бронирования билетов, пожалуйста, свяжитесь с нашей кассой. Операторы помогут вам с выбором и оформлением.
          </p>
          <div className="text-center">
            <p className="text-lg font-semibold">Телефон кассы:</p>
            <a href="tel:+73822999999" className="text-4xl font-bold text-brand-blue hover:underline">
              +7 (3822) 99-99-99
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Адрес аэропорта</h2>
            <p className="text-brand-gray mb-2">
              Касса и стойки регистрации находятся в здании аэровокзала.
            </p>
            <p className="text-xl font-semibold text-brand-dark">г. Томск, площадь Ленина, 1</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicContacts;