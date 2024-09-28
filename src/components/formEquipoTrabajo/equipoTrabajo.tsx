import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllRoles, Role } from "../../servicios/rol"; // Importa el servicio de roles
import { getAllZones, Zone } from "../../servicios/zone"; // Importa el servicio de zonas

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
    active?: boolean; // Agregado para el estado 'active'
  } | null; // El equipo seleccionado o null si es nuevo
  isEditing: boolean; // Si estamos en modo edición o no
  onSubmit: (user: any, password?: string) => void; // Función de submit
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
  const [active, setActive] = useState(true); // Nuevo estado para 'active'
  const [roles, setRoles] = useState<Role[]>([]); // Estado para los roles
  const [zonas, setZonas] = useState<Zone[]>([]); // Estado para las zonas

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

  // Efecto para cargar roles y zonas al abrir el modal
  useEffect(() => {
    if (show) {
      fetchRolesAndZones();
    }
  }, [show]);

  const fetchRolesAndZones = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData.data.rows); // Poblamos los roles
      const zonasData = await getAllZones();
      setZonas(zonasData); // Poblamos las zonas
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden.");
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
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmarContraseña">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  required
                />
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
