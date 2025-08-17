import './App.css';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Error from './components/Common/Error';
import NotFound from './pages/NotFound';
import { HomePage } from './pages/Home/Home';
import { OrganizationPage } from './pages/Organization/Organizations';
import { PricingPage } from './pages/Pricing/Pricing';
import { UsagePage } from './pages/Usage/Usage';
// import { EndpointTab } from './pages/Settings/Endpoint/Endpoint';
import { ResourcePage } from './pages/Resource/Resource';
import { PermissionTypeTab } from './pages/Permission/Permission';
import ChatWidget from "./components/ChatWidget/ChatWidget";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route 
        path="/" 
        element={<Navbar title="GATARI"/>}
        errorElement={<Error />}
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} errorElement={<Error />} />
        <Route path="organizations" element={<OrganizationPage />} errorElement={<Error />} />
        <Route path="subTier" element={<PricingPage />} errorElement={<Error />} />
        <Route path="usage" element={<UsagePage />} errorElement={<Error />} />
        <Route path="resources" element={<ResourcePage />} errorElement={<Error />} />
        <Route path="permissions" element={<PermissionTypeTab />} errorElement={<Error />} />
        {/* <Route path="resources" element={<SettingsPage />} errorElement={<Error />}>
          <Route index element={<Navigate to="types" replace />} errorElement={<Error />} />
          <Route path="endpoints" element={<EndpointTab />} errorElement={<Error />} />
          <Route path="types" element={<ResourceTypeTab />} errorElement={<Error />} />
          <Route path="permissions" element={<PermissionTypeTab />} errorElement={<Error />} />
        </Route> */}
      </Route>,
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ChatWidget />
    </>
  );
}
