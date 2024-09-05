export const paperStyle = {
    mb: 3, 
    overflow: 'hidden', 
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  };
  
  export const boxStyle = {
    p: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    cursor: 'pointer',
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.1)',
    },
    transition: 'background-color 0.2s',
  };
  
  export const formStyle = {
    p: 2, 
    display: 'grid', 
    gap: 2, 
    gridTemplateColumns: 'repeat(2, 1fr)',
  };
  
  export const buttonStyle = {
    gridColumn: '1 / -1', 
    mt: 2,
  };
  