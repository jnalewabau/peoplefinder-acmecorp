import React, { useEffect } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Button,
} from 'react-bootstrap'

import { useAuth } from 'oidc-react';
import history from '../utils/history'

import { useAserto } from '@aserto/aserto-react'
import { useUsers } from '../utils/users'

// hardcode some demo users
const identities = {
  'dfdadc39-7335-404d-af66-c77cf13a15f8': 'Euan',
  'd64b8476-3c5f-4caf-af6f-9a0f1c51d19f': 'Kris',
  '2bfaa552-d9a5-41e9-a6c3-5be62b4433c8': 'April'
};

const NavBar = () => {
  const dexAuth = useAuth();

  const isAuthenticated = dexAuth?.userData?.id_token ? true : false
  const user = dexAuth?.userData

  const { signIn, signOut } = dexAuth

  const { reload, identity, setIdentity } = useAserto();
  const { users } = useUsers();

  // set the current user by finding it in the user list based on the current identity
  let currentUser = user;
  if (identity && users) {
    const u = users.find(u => u.id === identity);
    currentUser = { ...u, name: u.display_name };
  }

  // If this is the demo version of the app, we are assured that the users exist in the IDP
  // and we'll find it based on the current user's email
  if (users && currentUser?.profile?.email) {
    const u = users.find(u => u.email === currentUser.profile.email)
    currentUser = { ...u, name: u.display_name };
  }

  // look up the user's display name for each of the hardcoded users
  if (users) {
    for (const id of Object.keys(identities)) {
      const u = users.find(u => u.id === id);
      identities[id] = u && u.display_name;
    }
  }

  const logoutWithRedirect = async () => {
    await signOut()
    history.push('/')
  };

  const loginWithRedirect = async () => {
    await signIn()
  }

  // set the identity in the Aserto hook
  const setUser = (u) => {
    setIdentity(u);
    // reload the display state if the user has not changed
    if (u === identity) {
      reload();
    }
  }

  // reload the display state map if the identity is changed
  useEffect(() => {
    reload();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  return (
    <div className="nav-container">
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand className="logo" />
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav as="ul" className="mr-auto">
              {!isAuthenticated &&
                <Nav.Item as="li">
                  <Nav.Link as={RouterNavLink}
                    to="/"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>
              }
              {isAuthenticated &&
                <Nav.Item as="li">
                  <Nav.Link as={RouterNavLink}
                    to="/people"
                    activeClassName="router-link-exact-active"
                  >
                    People
                  </Nav.Link>
                </Nav.Item>
              }
            </Nav>
            <Nav className="d-none d-md-block">
              {!isAuthenticated && (
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              )}
              {isAuthenticated && currentUser.picture && (
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} id="profileDropDown">
                    <img
                      src={currentUser.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="right">
                    <Dropdown.Header>{currentUser.name}</Dropdown.Header>
                    <Dropdown.Item as={RouterNavLink}
                      to="/profile"
                      exact
                      className="dropdown-profile"
                    >
                      <i className="fa fa-user mr-3" /> Profile
                    </Dropdown.Item>
                    {Object.keys(identities).map(i =>
                      <Dropdown.Item key={i} onClick={() => setUser(i)}>
                        <i className="fa fa-user mr-3" /> {identities[i]}
                      </Dropdown.Item>)
                    }

                    <Dropdown.Item
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <i className="fa fa-power-off mr-3" /> Log
                      out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none">
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                style={{ minHeight: 170 }}
              >
                <Nav.Item>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={RouterNavLink}
                    to="/profile"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    <i className="fa fa-user mr-3" />
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={RouterNavLink}
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    <i className="fa fa-power-off mr-3" />
                    Log out
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
