import * as React from 'react';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

interface TabItem {
  label: string;
  value: string;
}

interface ScrollableTabsButtonAutoProps {
  tabs: TabItem[];
  onTabChange: (newTab: string) => void;
  initialIndex?: number;
}

const TEAL = '#00897b';

// Styled Tab
const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 36,
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.8rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  '&:hover': {
    color: TEAL,
  },
  '&.Mui-selected': {
    color: TEAL,
    fontWeight: 600,
  },
}));

// Styled Tabs container
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 36,
  '& .MuiTabs-indicator': {
    backgroundColor: TEAL,
    height: 3,
  },
}));

export default function ScrollableTabsButtonAuto(
  props: ScrollableTabsButtonAutoProps
) {
  const [value, setValue] = React.useState(props.initialIndex || 0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const newIndex = props.tabs.findIndex(tab => tab.value === newValue);
    if (newIndex !== value) {
      setValue(newIndex);
      props.onTabChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: '100%', md: '800px' },
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <StyledTabs
        value={props.tabs[value]?.value || ''}
        onChange={handleChange}
        variant="standard"
        aria-label="styled compact tabs"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            display: 'none',
          },
        }}
      >
        {props.tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={
              <NavLink
                to={`/resources/${tab.value}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {tab.label}
              </NavLink>
            }
            value={tab.value}
          />
        ))}
      </StyledTabs>
    </Box>
  );
}