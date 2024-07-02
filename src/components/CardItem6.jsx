// components/CardItem.js

import React from 'react';

const CardItem6 = ({
  itemName,
  packaging,
  price,
  status,
  stock,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{itemName}</h3>
        <p className="text-gray-600 mb-2">Kemasan: {packaging}</p>
        <p className="text-gray-600 mb-2">Harga: Rp. {price}</p>
        <p className="text-gray-600 mb-2">Status: {status}</p>
        <p className="text-gray-600 mb-2">Stok: {stock}</p>
      </div>
    </div>
  );
};

export default CardItem6;
