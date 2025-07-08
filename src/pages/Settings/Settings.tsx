import { Outlet } from 'react-router-dom';
import '../../App.css';

export function SettingsPage() {
  return (
    <div className='container'>
      <div className='settings--container'>
        <Outlet />
      </div>
    </div>
  );
}