import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormRedProps {
  show: boolean;
  handleClose: () => void;
  roll: { nombreRed: string } | null; // El rol seleccionado, o null si es un nuevo rol
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormRed: React.FC<FormRedProps> = ({
  show,
  handleClose,
  roll,
  isEditing,
}) => {
  const [nombreRed, setNombreRed] = useState("");

  // Si estamos en modo edición y el rol existe, llenamos el formulario con los datos actuales
  useEffect(() => {
    if (isEditing && roll) {
      setNombreRed(roll.nombreRed); // Carga el nombre del rol si estamos editando
    } else {
      setNombreRed(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, roll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el rol
      console.log("Editando Red de Conexion:", nombreRed);
    } else {
      // Lógica para crear un nuevo rol
      console.log("Creando nueva Red de Conexion:", nombreRed);
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Red de Conexion" : "Crear Red de Conexion"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreRed">
            <Form.Label>Nombre de Red</Form.Label>
            <Form.Control
              type="text"
              value={nombreRed}
              onChange={(e) => setNombreRed(e.target.value)}
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

export default FormRed;
