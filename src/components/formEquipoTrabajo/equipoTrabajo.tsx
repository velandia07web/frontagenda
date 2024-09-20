import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormEquipoProps {
  show: boolean;
  handleClose: () => void;
  equipo: {
    nombre: string;
    email: string;
    cedula: number;
    telefono: string;
    rol: string;
    zona: string;
  } | null; // El equipo seleccionado o null si es nuevo
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormEquipoTrabajo: React.FC<FormEquipoProps> = ({
  show,
  handleClose,
  equipo,
  isEditing,
}) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState<number | "">("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("");
  const [zona, setZona] = useState("");

  // Cargar los datos del equipo si estamos en modo edición
  useEffect(() => {
    if (isEditing && equipo) {
      setNombre(equipo.nombre);
      setEmail(equipo.email);
      setCedula(equipo.cedula);
      setTelefono(equipo.telefono);
      setContraseña(""); // No cargamos la contraseña actual por razones de seguridad
      setRol(equipo.rol);
      setZona(equipo.zona);
    } else {
      // Resetear formulario para nuevo equipo
      setNombre("");
      setEmail("");
      setCedula("");
      setTelefono("");
      //setContraseña("");
      setRol("");
      setZona("");
    }
  }, [isEditing, equipo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el equipo
      console.log("Editando equipo:", {
        nombre,
        email,
        cedula,
        telefono,
        rol,
        zona,
      });
    } else {
      // Lógica para crear un nuevo equipo
      console.log("Creando nuevo equipo:", {
        nombre,
        email,
        cedula,
        telefono,
        contraseña,
        rol,
        zona,
      });
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Equipo" : "Crear Equipo"}
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

          <Form.Group controlId="contraseña">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required={!isEditing} // Solo requerimos contraseña en creación
            />
          </Form.Group>

          <Form.Group controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="zona">
            <Form.Label>Zona</Form.Label>
            <Form.Control
              as="select"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            >
              <option value="">Seleccione una zona</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Este">Este</option>
              <option value="Oeste">Oeste</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Equipo"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormEquipoTrabajo;
