import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./style.css";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [userInitial, setUserInitial] = React.useState(null); // To hold the user's initial
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // To check if user is logged in

  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token') || localStorage.getItem('token');
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserInitial(decodedToken.name.charAt(0));
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (type) => {
    setOpenModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setMessage(res.data);
      navigate('/inicio');
    } catch (err) {
      setMessage('Error registering');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setMessage(`Login successful, token: ${res.data.token}`);
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      navigate('/inicio');
    } catch (err) {
      console.log(err);
      setMessage('Error logging in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserInitial(null);
    navigate('/');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  return (
    <div>
      <div
        id="basic-button"
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        onClick={handleClick}
        className="profile-menu-flex"
      >
        <MenuRoundedIcon />
        {isAuthenticated ? (
          <span>{userInitial}</span>
        ) : (
          <AccountCircleRoundedIcon />
        )}
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          ".MuiPaper-root": {
            minWidth: "200px",
            borderRadius: "1rem",
            boxShadow: "0 1px 2px rgb(0 0 0 / 8%), 0 4px 12px rgb(0 0 0 / 5%)",
          },
        }}
      >
        {isAuthenticated ? (
          [
            <MenuItem key="messages" className="menu-items" onClick={handleCloseMenu}>
              Mensajes
            </MenuItem>,
            <MenuItem key="favorites" className="menu-items" onClick={handleCloseMenu}>
              Lista de Favoritos
            </MenuItem>,
            <MenuItem key="host" className="menu-items" onClick={handleCloseMenu}>
              Pon tu local en JGM
            </MenuItem>,
            <MenuItem key="help" className="menu-items" onClick={handleCloseMenu}>
              Centro de ayuda
            </MenuItem>,
            <MenuItem key="logout" className="menu-items" onClick={handleLogout}>
              Cerrar sesión
            </MenuItem>
          ]
        ) : (
          [
            <MenuItem key="signup" className="menu-items" onClick={() => handleOpenModal("Signup")}>
              Signup
            </MenuItem>,
            <MenuItem key="login" className="menu-items" onClick={() => handleOpenModal("Login")}>
              Login
            </MenuItem>,
            <div
              key="divider"
              style={{
                height: "1px",
                backgroundColor: "#d3d3d3",
                margin: "0.5rem 1rem",
              }}
            />,
            <MenuItem key="google-login" className="menu-items" onClick={handleGoogleLogin}>
              Login con Google
            </MenuItem>,
            <MenuItem key="facebook-login" className="menu-items" onClick={handleFacebookLogin}>
              Login con Facebook
            </MenuItem>,
          ]
        )}
      </Menu>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleRegister}>Register</Button>
            <p>{message}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
