// src/pages/checkout/AddAddressForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from '../../store/slices/checkout/addressSlice';
import InputField from '../../components/checkout/InputField';
import toast from 'react-hot-toast';

const AddAddressForm = ({ setOpenAddressModal, address }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.address);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const newAddress = { ...data, id: Date.now() };
      dispatch(addAddress(newAddress));
      toast.success(address ?
        '¡Dirección actualizada exitosamente!' :
        '¡Dirección agregada exitosamente!'
      );
      reset();
      setOpenAddressModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la dirección');
    }
  };

  const validations = {
    street: {
      required: "La calle es requerida"
    },
    city: {
      required: "La ciudad es requerida",
      pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: "La ciudad solo debe contener letras"
      }
    },
    state: {
      required: "El estado es requerido"
    },
    zipCode: {
      required: "El código postal es requerido",
      pattern: {
        value: /^\d{5}$/,
        message: "El código postal debe tener 5 dígitos"
      }
    },
    country: {
      required: "El país es requerido"
    }
  };

  useEffect(() => {
    if (address) {
      Object.keys(address).forEach(key => {
        setValue(key, address[key]);
      });
    }
  }, [address, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <h5 className="mb-3 fw-bold text-primary">
        {address ? "Editar Dirección" : "Agregar Nueva Dirección"}
      </h5>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <InputField
        label="Calle"
        id="street"
        type="text"
        register={register}
        errors={errors}
        validations={validations.street}
        placeholder="Ej: Av. Reforma 123"
      />

      <InputField
        label="Ciudad"
        id="city"
        type="text"
        register={register}
        errors={errors}
        validations={validations.city}
        placeholder="Ej: Ciudad de México"
      />

      <InputField
        label="Estado"
        id="state"
        type="text"
        register={register}
        errors={errors}
        validations={validations.state}
        placeholder="Ej: CDMX"
      />

      <InputField
        label="Código Postal"
        id="zipCode"
        type="text"
        register={register}
        errors={errors}
        validations={validations.zipCode}
        placeholder="Ej: 12345"
      />

      <InputField
        label="País"
        id="country"
        type="text"
        register={register}
        errors={errors}
        validations={validations.country}
        placeholder="Ej: México"
      />

      <div className="d-grid gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            address ? "Actualizar Dirección" : "Guardar Dirección"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddAddressForm;