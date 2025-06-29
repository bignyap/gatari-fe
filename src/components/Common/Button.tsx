import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'useTeal',
})<{ useTeal?: boolean }>(({ theme, useTeal }) => ({
  textTransform: 'uppercase',
  fontWeight: 500,
  fontSize: '0.78rem',
  minHeight: 32,
  padding: theme.spacing(0.7, 1.8),
  borderRadius: 6,
  transition: 'all 0.2s ease-in-out',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  ...(useTeal
    ? {
        backgroundColor: 'rgba(0, 137, 123, 0.15)',
        color: '#004d40',
        border: '1px solid rgba(0, 137, 123, 0.35)',
        '&:hover': {
          backgroundColor: 'rgba(0, 137, 123, 0.25)',
          boxShadow: theme.shadows[2],
          borderColor: '#00897b',
        },
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        color: '#1a1a1a',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(0, 0, 0, 0.25)',
          boxShadow: theme.shadows[1],
          transform: 'translateY(-1px)',
        },
      }),
}));

type CommonButtonProps<C extends React.ElementType = 'button'> = {
  label: string;
  startIcon?: React.ReactNode;
  component?: C;
  useTeal?: boolean;
} & Omit<ButtonProps<C>, 'component' | 'children'>;

const CommonButton = <C extends React.ElementType = 'button'>({
  label,
  startIcon,
  component,
  useTeal,
  ...rest
}: CommonButtonProps<C>) => {
  return (
    <StyledButton
      component={component}
      role={component === 'label' ? undefined : 'button'}
      startIcon={startIcon}
      size="small"
      tabIndex={-1}
      useTeal={useTeal}
      {...rest}
    >
      {label}
    </StyledButton>
  );
};

export default CommonButton;