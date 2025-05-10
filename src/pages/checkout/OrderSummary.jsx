// OrderSummary.jsx
import React from 'react';
import { useSelector } from 'react-redux';

export const OrderSummary = () => {
  const carrito = useSelector(state => state.carrito);
  const direccionSeleccionada = useSelector(state => state.direccion.direccionSeleccionada);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
      
      {/* Detalles del carrito */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Productos</h3>
        {carrito.items?.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.nombre} x {item.cantidad}</span>
            <span>${item.precio * item.cantidad}</span>
          </div>
        ))}
      </div>

      {/* Dirección de envío */}
      {direccionSeleccionada && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Dirección de envío</h3>
          <div className="border p-3 rounded">
            <p>{direccionSeleccionada.buildingName}</p>
            <p>{direccionSeleccionada.street}</p>
            <p>{`${direccionSeleccionada.city}, ${direccionSeleccionada.state} ${direccionSeleccionada.pincode}`}</p>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>${carrito.total}</span>
        </div>
      </div>
    </div>
  );
};