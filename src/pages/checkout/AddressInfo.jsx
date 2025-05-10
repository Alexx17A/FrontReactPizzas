// En AddressInfo.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAddress, removeAddress } from '../../store/slices/checkout/addressSlice';
import AddAddressForm from './AddAddressForm';
import AddressInfoModal from './AddressInfoModal';
import DeleteModal from './DeleteModal';
import { Button } from '@mui/material';
import { FaAddressBook } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const AddressInfo = () => {
  const dispatch = useDispatch();
  const { addresses, selectedAddress } = useSelector(state => state.address);
  const [openAddressModal, setOpenAddressModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [addressToEdit, setAddressToEdit] = React.useState(null);
  const [addressToDelete, setAddressToDelete] = React.useState(null);

  const handleSelectAddress = (address) => {
    dispatch(selectAddress(address));
  };

  const handleEdit = (address) => {
    setAddressToEdit(address);
    setOpenAddressModal(true);
  };

  const handleDelete = (address) => {
    setAddressToDelete(address);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      dispatch(removeAddress(addressToDelete.id));
      // Si la dirección eliminada era la seleccionada, limpiar la selección
      if (selectedAddress?.id === addressToDelete.id) {
        dispatch(selectAddress(null));
      }
      toast.success('Dirección eliminada exitosamente');
    }
    setOpenDeleteModal(false);
    setAddressToDelete(null);
  };

  const handleAddNew = () => {
    setAddressToEdit(null);
    setOpenAddressModal(true);
  };

  return (
    <div className="pt-4">
      {addresses.length === 0 ? (
        <div className="p-4 rounded shadow bg-light mx-auto text-center"
          style={{ maxWidth: "28rem" }}>
          <FaAddressBook size={50} className="text-secondary mb-3" />
          <h1 className="mb-2 text-dark fw-semibold fs-4">
            No tienes direcciones de envío
          </h1>
          <p className="mb-4 text-muted">
            Agrega una dirección de envío para continuar con tu compra.
          </p>
          <Button
            variant="contained"
            onClick={handleAddNew}
          >
            Agregar Dirección
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Direcciones de envío</h2>
            <Button
              variant="contained"
              onClick={handleAddNew}
            >
              Agregar Nueva Dirección
            </Button>
          </div>

          <div>
            {addresses.map(address => (
              <div key={address.id}>
                <button onClick={() => handleSelectAddress(address)}>
                  {address.street}, {address.city}, {address.state}
                </button>
                {selectedAddress && selectedAddress.id === address.id && (
                  <span> (Seleccionada)</span>
                )}
                <button onClick={() => handleEdit(address)}>Editar</button>
                <button onClick={() => handleDelete(address)}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddressInfoModal
        open={openAddressModal}
        onClose={() => setOpenAddressModal(false)}
      >
        <AddAddressForm
          address={addressToEdit}
          setOpenAddressModal={setOpenAddressModal}
        />
      </AddressInfoModal>

      <DeleteModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar dirección"
        message={`¿Estás seguro de que deseas eliminar la dirección ${addressToDelete?.street || ''}?`}
      />
    </div>
  );
};

export default AddressInfo;