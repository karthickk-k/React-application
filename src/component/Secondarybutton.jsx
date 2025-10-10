import Button from '@mui/material/Button';

const Secondarybutton = ({ children, onClick, variant = 'outlined', sx, ...rest }) => {
    return (
        <Button
            variant={variant}
            sx={{
                mt: 3, mb: 2,
                backgroundColor: '#FFFF',
                color: '#DD0303',
                borderColor: '#DD0303',
                borderRadius: 3,
                '&:hover': {
                    backgroundColor: '#DD0303',
                    borderColor: '#DD0303',
                    color: '#FFFF',
                },
            }}
            onClick={onClick}
            {...rest}>
            {children}
        </Button>
    );
};

export default Secondarybutton;