import React from 'react';
import { Radio, RadioGroup, FormControlLabel, Paper, Button } from '@mui/material';

export const AddressList = ({ addresses, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <RadioGroup>
        {addresses.map((address) => (
          <Paper key={address.id} className="p-4 mb-3">
            <div className="flex items-center justify-between">
              <FormControlLabel
                value={address.id}
                control={<Radio />}
                label={
                  <div>
                    <p className="font-semibold">{address.buildingName}</p>
                    <p>{address.street}</p>
                    <p>{`${address.city}, ${address.state} ${address.pincode}`}</p>
                  </div>
                }
              />
              <div className="space-x-2">
                <Button 
                  size="small" 
                  onClick={() => onEdit(address)}
                >
                  Editar
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => onDelete(address.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Paper>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AddressList;