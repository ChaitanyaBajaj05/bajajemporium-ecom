import React from "react";

const fabricList = [
  {
    name: "Velvet",
    image: "https://tse1.mm.bing.net/th/id/OIP.rMnQnkOwv2-Kuhq-Bx8ZEQAAAA?pid=Api&P=0&h=180",
  },
  {
    name: "Linen",
    image: "https://tse1.mm.bing.net/th/id/OIP.6FbpS6DhCvYBJE51ZF5YzgHaFj?pid=Api&P=0&h=180",
  },
  {
    name: "Cotton",
    image: "https://www.shansfabrics.co.uk/wp-content/uploads/DSCF0659.jpg",
  },
  {
    name: "Silk",
    image: "https://i.etsystatic.com/14636520/r/il/c2d4e5/1698896088/il_fullxfull.1698896088_q49k.jpg",
  },
  {
    name: "Chiffon",
    image: "https://tse1.mm.bing.net/th/id/OIP.DLoguybfj7yCp3y7Ev-Z3wHaHa?pid=Api&P=0&h=180",
  },
  {
    name: "Georgette",
    image: "http://image.made-in-china.com/2f0j00cCnTjEhJSAoW/Silk-Georgette-Solid-Fabric.jpg",
  },
  {
    name: "Rayon",
    image: "https://tse2.mm.bing.net/th/id/OIP.EpE29Uorr71f72uyDvAG0QHaE8?pid=Api&P=0&h=180",
  },
  {
    name: "Organza",
    image: "https://tse3.mm.bing.net/th/id/OIP.vTPlWOXrzvNLXAw8DsaH7AHaE8?pid=Api&P=0&h=180",
  },
];

export default function Fabrics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Explore Fabrics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {fabricList.map((fabric, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="overflow-hidden">
              <img
                src={fabric.image}
                alt={fabric.name}
                className="h-56 w-full object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {fabric.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
