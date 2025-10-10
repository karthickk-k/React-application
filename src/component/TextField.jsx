import { TextField } from '@mui/material';

const Field = ({ label, value, onChange, variant = "standard", sx, type = 'text', ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      sx={sx}
      variant={variant}
      onChange={onChange}
      type={type}
      {...props} 
    />
  );
};

export default Field;