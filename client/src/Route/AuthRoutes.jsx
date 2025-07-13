import CreatePwd from '../Components/Pages/Auth/CreatePwd';
import ForgetPwd from '../Components/Pages/Auth/ForgetPwd';
import LoginOne from '../Components/Pages/Auth/LoginOne';
import LoginSweetalert from '../Components/Pages/Auth/LoginSweetalert';
import LoginTooltip from '../Components/Pages/Auth/LoginTooltip';
import LoginTwo from '../Components/Pages/Auth/LoginTwo';
import LoginValidation from '../Components/Pages/Auth/LoginValidation';
import Maintenance from '../Components/Pages/Auth/Maintenance';
import RegisterBgImg from '../Components/Pages/Auth/RegisterBgImg';
import RegisterSimple from '../Components/Pages/Auth/RegisterSimple';
import RegisterVideo from '../Components/Pages/Auth/RegisterVideo';
import UnlockUser from '../Components/Pages/Auth/UnlockUser';
import Logins from '../Auth/Signin';
import LoginForm from '../Components/Pages/Auth/LoginForm';

export const authRoutes = [
  { path: `${process.env.PUBLIC_URL}/login`, Component: <Logins /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-simple/:layout`, Component: <LoginForm /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-img/:layout`, Component: <LoginOne /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-bg-img/:layout`, Component: <LoginTwo /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-validation/:layout`, Component: <LoginValidation /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-tooltip/:layout`, Component: <LoginTooltip /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/login-sweetalert/:layout`, Component: <LoginSweetalert /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/register-simple/:layout`, Component: <RegisterSimple /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/register-bg-img/:layout`, Component: <RegisterBgImg /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/register-video/:layout`, Component: <RegisterVideo /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/unlock-user/:layout`, Component: <UnlockUser /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/forget-pwd/:layout`, Component: <ForgetPwd /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/create-pwd/:layout`, Component: <CreatePwd /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/maintenance/:layout`, Component: <Maintenance /> },

];
