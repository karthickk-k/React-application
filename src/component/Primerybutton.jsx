import Button from '@mui/material/Button';

const MyButton = ({ children, onClick, variant = 'outlined', sx, ...rest }) => {
    return (
        <Button
            variant={variant}
            sx={{
                mt: 5, mb: 2, p: 1,
                color: '#000000',
                boxShadow: 3,
                fontWeight: 600,
                fontSize: '16px',
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: '#40A865',
                    color: '#000000',
                },
            }}
            onClick={onClick}
            {...rest}
        >
            {children}
        </Button>
    );
};

export default MyButton;