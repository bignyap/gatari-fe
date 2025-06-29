import { Outlet } from 'react-router-dom';
import '../../styles/main.css';

export function SettingsPage() {
  return (
    <div className='container'>
      <div className='settings--container'>
        <Outlet />
      </div>
    </div>
  );
}