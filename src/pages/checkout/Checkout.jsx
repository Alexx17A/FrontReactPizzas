// src/pages/checkout/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js"; // Cambiar esta importación
import { loadStripe } from "@stripe/stripe-js";
import {
  nextStep,
  prevStep,
  setSelectedAddress,
  setPaymentMethod,
  selectClientSecret,
  selectSelectedAddress, // Cambiar esto
  selectPaymentMethod, // Cambiar esto
  setLoading,
  setError,
  resetCheckout, // Cambiar esto
} from "../../store/slices/checkout/checkoutSlice";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  createPaymentIntent, // Importa el thunk
  confirmOrder, // Importa el thunk
  fetchCart, // Importa el thunk
} from "../../store/slices/checkout/checkoutThunks";
import AddressInfoModal from "./componets/AddressStep/AddressInfoModal";
import AddressList from "./componets/AddressStep/AddressList";
import AddAddressForm from "./componets/AddressStep/AddAddressForm";
import PaymentMethodStep from "./componets/PaymentMethodStep/PaymentMethodStep";
import CheckoutSummary from "./componets/SummaryStep/ChekoutSummary";
import StripePaymentForm from "./componets/ConfirmationStep/StripePaymentForm";
import { stripePromise } from "../../config/stripe";

const steps = ["Dirección", "Pago", "Resumen", "Confirmación"];

const Checkout = () => {
  //uso de los redux
  const dispatch = useDispatch();
  const { step, addressList, loading, error } = useSelector(
    (state) => state.checkout
  );

  const selectedAddress = useSelector(selectSelectedAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const clientSecret = useSelector(selectClientSecret);

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  //verificar stripe
  useEffect(() => {
    const verifyStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (stripe) {
          console.log("Stripe cargado correctamente");
          setStripeLoaded(true);
        } else {
          throw new Error("No se pudo inicializar Stripe");
        }
      } catch (err) {
        console.error("Error al cargar Stripe:", err);
        toast.error(
          "El sistema de pagos no está disponible en este momento. Por favor, intenta más tarde."
        );
        setStripeLoaded(false);
      }
    };

    verifyStripe();
  }, []);

  // Cargar direcciones del usuario
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        await dispatch(fetchAddresses()).unwrap();
      } catch (error) {
        toast.error("Error al cargar las direcciones");
        console.error("Error loading addresses:", error);
      }
    };
    loadAddresses();
  }, [dispatch]);

  // Manejadores de direcciones
  const handleAddAddress = async (addressData) => {
    try {
      await dispatch(createAddress(addressData)).unwrap();
      setShowModal(false);
      toast.success("Dirección agregada exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al agregar la dirección");
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      await dispatch(
        updateAddress({
          addressId: editingAddress.addressId,
          addressData,
        })
      ).unwrap();

      setShowModal(false);
      setEditingAddress(null);
      toast.success("Dirección actualizada exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al actualizar la dirección");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("¿Estás seguro de eliminar esta dirección?")) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success("Dirección eliminada exitosamente");
      } catch (error) {
        toast.error(error.message || "Error al eliminar la dirección");
      }
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleSelectAddress = (address) => {
    dispatch(setSelectedAddress(address));
  };

  const handlePaymentMethodSelect = (method) => {
    dispatch(setPaymentMethod(method));
  };

  const handleNext = () => {
    if (step === 0 && !selectedAddress) {
      toast.error("Por favor selecciona una dirección");
      return;
    }
    if (step === 1 && !paymentMethod) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }
    // Simplemente avanzar al siguiente paso
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      // Llama al thunk con el objeto correcto
      await dispatch(
        confirmOrder({
          addressId: selectedAddress.addressId,
          paymentIntent,
        })
      ).unwrap();
      toast.success("Pago realizado con éxito. ¡Gracias por tu compra!");
      dispatch(nextStep()); // Avanza al paso de confirmación
      dispatch(resetCheckout()); // Limpia todo el estado y localStorage
    } catch (error) {
      toast.error(
        error.message ||
          "Error al confirmar la orden. Por favor, intenta de nuevo."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  // Vista cuando no hay direcciones
  const renderNoAddresses = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <div className="mb-4">
          <i
            className="bi bi-geo-alt text-primary"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>
        <h3 className="card-title">No tienes direcciones guardadas</h3>
        <p className="text-muted mb-4">
          Agrega una dirección para continuar con tu compra
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setShowModal(true)}
        >
          Agregar dirección
        </button>
      </div>
    </div>
  );

  // Renderizado condicional basado en el paso actual
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Dirección de envío</h3>
              {addressList.length === 0 ? (
                renderNoAddresses()
              ) : (
                <>
                  <AddressList
                    addresses={addressList}
                    selectedAddress={selectedAddress}
                    onSelect={handleSelectAddress}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setEditingAddress(null);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Agregar nueva dirección
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={!selectedAddress}
                      onClick={handleNext}
                    >
                      Continuar
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <PaymentMethodStep
                selectedMethod={paymentMethod}
                onSelectPaymentMethod={handlePaymentMethodSelect}
              />
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleBack}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={!paymentMethod}
                >
                  Continuar
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Resumen del pedido</h3>
              <CheckoutSummary onProceedToPayment={handleNext} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Pago</h3>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                  }}
                >
                  <StripePaymentForm onSuccess={handlePaymentSuccess} />
                </Elements>
              )}
            </div>
          </div>
        );
      case 4:
       return (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-4">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h3 className="card-title">¡Pedido confirmado!</h3>
              <p className="text-muted">
                Gracias por tu compra. Recibirás un correo con los detalles de
                tu pedido.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      {/* Progress Steps */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between position-relative align-items-center">
            {steps.map((label, index) => (
              <div key={index} className="text-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2
                    ${index <= step ? "bg-primary" : "bg-light"}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    color: index <= step ? "white" : "gray",
                    border: "2px solid",
                    borderColor: index <= step ? "#007bff" : "#dee2e6",
                  }}
                >
                  {index + 1}
                </div>
                <div
                  className={
                    index === step ? "text-primary fw-bold" : "text-muted"
                  }
                >
                  {label}
                </div>
              </div>
            ))}
            <div
              className="position-absolute"
              style={{
                top: "20px",
                left: "50px",
                right: "50px",
                height: "2px",
                backgroundColor: "#dee2e6",
                zIndex: -1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        renderStep()
      )}

      {/* Modal */}
      <AddressInfoModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? "Editar dirección" : "Agregar dirección"}
      >
        <AddAddressForm
          initialData={editingAddress}
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
        />
      </AddressInfoModal>
    </div>
  );
};

export default Checkout;
