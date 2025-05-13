// src/pages/checkout/components/SummaryStep/CheckoutSummary.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCart, createPaymentIntent } from '../../../../store/slices/checkout/checkoutThunks';
import { selectOrderSummary, selectSelectedAddress, selectLoading, prevStep,setLoading,setError } from '../../../../store/slices/checkout/checkoutSlice';

const CheckoutSummary = ({ onProceedToPayment }) => {
  const dispatch = useDispatch();
  const orderSummary = useSelector(selectOrderSummary);
  const selectedAddress = useSelector(selectSelectedAddress);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (!orderSummary) {
      dispatch(fetchCart());
    }
  }, [dispatch, orderSummary]);

const handleProceedToPayment = async () => {
  try {
    if (!orderSummary?.totalPrice) {
      toast.error('No se ha podido obtener el total de la orden');
      return;
    }
console.log('Intentando crear el payment intent');
      console.log('Total Price:', orderSummary.totalPrice);
    dispatch(setLoading(true));
    const clientSecret = await dispatch(
      
      createPaymentIntent(orderSummary.totalPrice)
    ).unwrap();

    if (clientSecret) {
      onProceedToPayment(clientSecret);
    }
  } catch (error) {
    console.error('Error en la creación del payment intent:', error);
    toast.error(
      error.message || 'Error al crear la intención de pago. Intenta de nuevo.'
    );
  } finally {
    dispatch(setLoading(false));
  }
};

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!orderSummary || !selectedAddress) {
    return (
      <div className="alert alert-warning">
        No se pudo cargar la información del pedido.
      </div>
    );
  }

  return (
    <div className="summary-container">
      {/* Dirección de envío */}
      <div className="mb-4">
        <h4 className="mb-3">Dirección de envío</h4>
        <div className="card">
          <div className="card-body">
            <p className="mb-1">{selectedAddress.buildingName}</p>
            <p className="mb-1">{selectedAddress.street}</p>
            <p className="mb-1">
              {selectedAddress.city}, {selectedAddress.state}
            </p>
            <p className="mb-1">{selectedAddress.country}</p>
            <p className="mb-0">CP: {selectedAddress.pincode}</p>
          </div>
        </div>
      </div>

      {/* Productos */}
      
      <div className="mb-4">
        <h4 className="mb-3">Productos</h4>
        {orderSummary.products.map((product) => (
          <div key={product.productId} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={product.image || 'https://placehold.co/100x100'}
                    alt={product.productName}
                    className="me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0">{product.productName}</h6>
                    <small className="text-muted">Cantidad: {product.quantity}</small>
                    {product.description && (
                      <p className="small text-muted mb-0">{product.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <p className="mb-0 fw-bold">${product.specialPrice * product.quantity}</p>
                  {product.discount > 0 && (
                    <small className="text-success">
                      Ahorro: ${product.discount * product.quantity}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de costos */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>${orderSummary.totalPrice}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${orderSummary.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Botón de pago */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-primary"
          onClick={() => dispatch(prevStep())}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </button>
        <button
          className="btn btn-primary"
          onClick={handleProceedToPayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Procesando...
            </>
          ) : (
            <>
              Continuar al pago
              <i className="bi bi-arrow-right ms-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;