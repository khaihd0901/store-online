import React from 'react';

const Features = () => {
  const services = [
    {
      id: "cart-outline",
      title: "Free delivery",
      desc: "Consectetur adipi elit lorem ipsum dolor sit amet."
    },
    {
      id: "quality",
      title: "Quality guarantee",
      desc: "Dolor sit amet orem ipsu mcons ectetur adipi elit."
    },
    {
      id: "price-tag",
      title: "Daily offers",
      desc: "Amet consectetur adipi elit loreme ipsum dolor sit."
    },
    {
      id: "shield-plus",
      title: "100% secure payment",
      desc: "Rem Lopsum dolor sit amet, consectetur adipi elit."
    }
  ];

  return (
    <section id="company-services" className="pt-16 pb-8 bg-white">
      {/* ĐÃ SỬA: Xóa md:px-10 để lề căn chuẩn với Logo trên Header */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-2">
          
          {services.map((service, index) => (
            <div key={index} className="w-full lg:w-1/4 md:w-1/2 px-4 pb-8 lg:pb-0">
              <div className="icon-box flex items-start">
                <div className="icon-box-icon pr-4 mt-1">
                  <svg className="w-8 h-8 text-red-400">
                    <use xlinkHref={`#${service.id}`} />
                  </svg>
                </div>
                <div className="icon-box-content">
                  <h4 className="text-lg font-semibold capitalize text-gray-900 mb-1">{service.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed pr-4">{service.desc}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;