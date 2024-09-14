import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormEquipoProps {
  show: boolean;
  handleClose: () => void;
  roll: { nombre: string } | null; // El rol seleccionado, o null si es un nuevo rol
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormRoll: React.FC<FormEquipoProps> = ({
  show,
  handleClose,
  roll,
  isEditing,
}) => {
  const [nombre, setNombreequipo] = useState("");

  // Si estamos en modo edición y el rol existe, llenamos el formulario con los datos actuales
  useEffect(() => {
    if (isEditing && roll) {
      setNombreequipo(roll.nombre); // Carga el nombre del rol si estamos editando
    } else {
      setNombreequipo(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, roll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el rol
      console.log("Editando Usuario:", nombre);
    } else {
      // Lógica para crear un nuevo rol
      console.log("Creando nuevo Usuario:", nombre);
    }
    handleClose(); // Cierra el modal después de guardar
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
            <Form.Label>Nombre del Usuario</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombreequipo(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Usuario"}
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

export default FormRoll;
