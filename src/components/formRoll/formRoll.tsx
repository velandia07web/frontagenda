import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormRollProps {
  show: boolean;
  handleClose: () => void;
  roll: { nombreRoll: string } | null; // El rol seleccionado, o null si es un nuevo rol
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormRoll: React.FC<FormRollProps> = ({
  show,
  handleClose,
  roll,
  isEditing,
}) => {
  const [nombreRoll, setNombreRoll] = useState("");

  // Si estamos en modo edición y el rol existe, llenamos el formulario con los datos actuales
  useEffect(() => {
    if (isEditing && roll) {
      setNombreRoll(roll.nombreRoll); // Carga el nombre del rol si estamos editando
    } else {
      setNombreRoll(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, roll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el rol
      console.log("Editando rol:", nombreRoll);
    } else {
      // Lógica para crear un nuevo rol
      console.log("Creando nuevo rol:", nombreRoll);
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Rol" : "Crear Rol"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreRoll">
            <Form.Label>Nombre del Rol</Form.Label>
            <Form.Control
              type="text"
              value={nombreRoll}
              onChange={(e) => setNombreRoll(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Rol"}
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
