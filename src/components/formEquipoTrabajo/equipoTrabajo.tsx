import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { getAllRoles, Role } from "../../servicios/rol";
import { getAllZones, Zone } from "../../servicios/zone";

interface FormEquipoProps {
  show: boolean;
  handleClose: () => void;
  equipo: {
    name: string;
    lastName: string;
    email: string;
    cedula: number;
    phone: string;
    idRol: string;
    idZone: string;
    active?: boolean;
  } | null;
  isEditing: boolean;
  onSubmit: (user: any, password?: string) => void;
}

const FormEquipoTrabajo: React.FC<FormEquipoProps> = ({
  show,
  handleClose,
  equipo,
  isEditing,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState<number | "">("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContrasena] = useState("");
  const [confirmarContraseña, setConfirmarContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [zona, setZona] = useState("");
  const [active, setActive] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [zonas, setZonas] = useState<Zone[]>([]);
  const [errorContraseña, setErrorContraseña] = useState(false); // Estado para el error de contraseña
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Mensaje de alerta

  useEffect(() => {
    if (isEditing && equipo) {
      setNombre(equipo.name);
      setLastName(equipo.lastName);
      setEmail(equipo.email);
      setCedula(equipo.cedula);
      setTelefono(equipo.phone);
      setRol(equipo.idRol);
      setZona(equipo.idZone);
      setActive(equipo.active !== undefined ? equipo.active : true);
      setContrasena("");
      setConfirmarContrasena("");
    } else {
      resetForm();
    }
  }, [isEditing, equipo]);

  useEffect(() => {
    if (show) {
      fetchRolesAndZones();
    }
  }, [show]);

  const fetchRolesAndZones = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData.data.rows);
      const zonasData = await getAllZones();
      setZonas(zonasData);
    } catch (error) {
      console.error("Error al cargar roles y zonas:", error);
    }
  };

  const resetForm = () => {
    setNombre("");
    setLastName("");
    setEmail("");
    setCedula("");
    setTelefono("");
    setContrasena("");
    setConfirmarContrasena("");
    setRol("");
    setZona("");
    setActive(true);
    setErrorContraseña(false);
    setShowAlert(false); // Resetear el estado de la alerta
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && contraseña !== confirmarContraseña) {
      setErrorContraseña(true);
      setAlertMessage("Las contraseñas no coinciden.");
      setShowAlert(true);
      return;
    }

    const userData = {
      name: nombre,
      lastName: apellido,
      email,
      cedula,
      phone: telefono,
      idRol: rol,
      idZone: zona,
      active,
    };

    onSubmit(userData, isEditing ? undefined : contraseña);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Usuario" : "Crear Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="apellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={apellido}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="cedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="number"
              value={cedula}
              onChange={(e) => setCedula(Number(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group controlId="telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo de Contraseña (solo en creación) */}
          {!isEditing && (
            <>
              <Form.Group controlId="contraseña">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={contraseña}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    setErrorContraseña(false);
                  }}
                  isInvalid={errorContraseña} // Estilo para invalidación
                  required
                />
                {errorContraseña && (
                  <Form.Control.Feedback type="invalid">
                    Las contraseñas no coinciden.
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group controlId="confirmarContraseña">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmarContraseña}
                  onChange={(e) => {
                    setConfirmarContrasena(e.target.value);
                    setErrorContraseña(false);
                  }}
                  isInvalid={errorContraseña} // Estilo para invalidación
                  required
                />
                {errorContraseña && (
                  <Form.Control.Feedback type="invalid">
                    Las contraseñas no coinciden.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </>
          )}

          {/* Select para los roles */}
          <Form.Group controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Select para las zonas */}
          <Form.Group controlId="zona">
            <Form.Label>Zona</Form.Label>
            <Form.Control
              as="select"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            >
              <option value="">Selecciona una zona</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="active">
            <Form.Check
              type="checkbox"
              label="Activo"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormEquipoTrabajo;
