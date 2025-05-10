// src/pages/checkout/AddressInfoModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AddressInfoModal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content position-relative">
          <div className="modal-header">
            <h5 className="modal-title">Dirección</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoModal;