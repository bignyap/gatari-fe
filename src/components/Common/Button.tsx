import React from 'react';
import {
  Button,
  ButtonProps,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'useTeal',
})<{ useTeal?: boolean }>(({ theme, useTeal }) => ({
  minHeight: 32,
  minWidth: 36,
  padding: theme.spacing(0.8, 1.6),
  borderRadius: 6,
  fontSize: '0.78rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textTransform: 'uppercase',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  whiteSpace: 'nowrap',         // 🔒 prevent wrapping
  overflow: 'hidden',           // 🔒 hide overflow
  textOverflow: 'ellipsis',     // 🔒 add '...'

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buttonContent = (
    <StyledButton
      component={component}
      role={component === 'label' ? undefined : 'button'}
      startIcon={startIcon}
      size="small"
      tabIndex={-1}
      useTeal={useTeal}
      title={isMobile ? undefined : label} // fallback tooltip for truncated text
      {...rest}
    >
      {!isMobile && label}
    </StyledButton>
  );

  return isMobile ? (
    <Tooltip title={label}>
      <span>{buttonContent}</span>
    </Tooltip>
  ) : (
    buttonContent
  );
};

export default CommonButton;