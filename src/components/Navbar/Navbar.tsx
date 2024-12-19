// components/NavbarComponent.jsx

import React from "react";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Dropdown, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllNotificationsbyUser, Notification } from "../../servicios/notifications";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { logout } from "../../servicios/authService"; // Importar el servicio de logout

const NavbarComponent: React.FC = () => {
  const [notification, useNotification] = useState<Notification[]>([])
  const notificationCount = notification.length; // Ejemplo: número de notificaciones

  useEffect(() => {
      const fetchZones = async () => {
        try {
          const userid = localStorage.getItem("userId")
          const notiData = await getAllNotificationsbyUser(userid || "");
          useNotification(notiData);
        } catch (error) {
          console.error("Error al obtener las zonas: ", error);
        }
      };
  
      fetchZones();
    }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      //alert("Sesión cerrada correctamente");
      window.location.href = "/"; // Redirigir al login
    } else {
      alert("Error al cerrar la sesión1");
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="navbarA">
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav
            className="my-2 my-lg-0"
            navbarScroll
            style={{ maxHeight: "100px" }}
          >
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="notificaciones"
                className="custom-badge position-relative"
              >
                <FontAwesomeIcon icon={faBell} />
                {notificationCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
              {notification.map((noti) => (
                <Dropdown.Item key={noti.id} href="#">
                  {noti.description}
                </Dropdown.Item>
              ))}
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link
              href="#"
              className="custom-csesion"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />{" "}
              {/* Icono de cerrar sesión */}
              Cerrar sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
