// src/pages/checkout/Checkout.jsx
import React from 'react';
import { Step, StepLabel, Stepper, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AddressInfo } from './AddressInfo';
import { PaymentMethod } from './PaymentMethod';
import { OrderSummary } from './OrderSummary';
import { useAuth } from '../../context/AuthContext';
import { nextStep, prevStep } from '../../store/slices/checkout/checkoutSlice'; // Vamos a crear este slice

export const Checkout = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector(state => state.checkout);
  const { selectedAddress } = useSelector(state => state.address);
  const { paymentMethod } = useSelector(state => state.payment);
  const { isLoggedIn } = useAuth();

  const steps = [
    'Dirección de Envío',
    'Método de Pago',
    'Revisión y Confirmación'
  ];

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0:
        return !!selectedAddress; // Puede avanzar si hay una dirección seleccionada
      case 1:
        return !!paymentMethod; // Puede avanzar si hay un método de pago seleccionado
      case 2:
        return true; // Siempre puede finalizar en el último paso
      default:
        return false;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressInfo />;
      case 1:
        return <PaymentMethod />;
      case 2:
        return <OrderSummary />;
      default:
        return 'Unknown step';
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className='py-14 min-h-[calc(100vh-100px)]'>
      <div className="container mx-auto px-4">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className='mt-8'>
          {getStepContent(activeStep)}
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handlePrev}
          >
            Atrás
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
          >
            {activeStep === steps.length - 1 ? 'Finalizar Compra' : 'Siguiente'}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Checkout;