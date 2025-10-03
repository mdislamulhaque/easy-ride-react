// src/components/home/StatsSection.jsx
export default function StatsSection() {
  const stats = [
    { id: 1, text: "+ 5000 SUBSCRIBED CUSTOMERS" },
    { id: 2, text: "+ 1080 ORDERS PLACED FROM ABROAD" },
    { id: 3, text: "50 EXPERIENCED AND PROFESSIONAL DRIVERS" },
  ];

  return (
    <section className="bg-red-600 text-white py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center gap-6 text-center font-bold text-lg">
        {stats.map((item) => (
          <p key={item.id} className="uppercase">
            {item.text}
          </p>
        ))}
      </div>
    </section>
  );
}
