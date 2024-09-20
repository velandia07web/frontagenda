import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormZonaProps {
  show: boolean;
  handleClose: () => void;
  roll: { nombreZona: string } | null; // El rol seleccionado, o null si es un nuevo rol
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormZona: React.FC<FormZonaProps> = ({
  show,
  handleClose,
  roll,
  isEditing,
}) => {
  const [nombreZona, setNombreZona] = useState("");

  // Si estamos en modo edición y el rol existe, llenamos el formulario con los datos actuales
  useEffect(() => {
    if (isEditing && roll) {
      setNombreZona(roll.nombreZona); // Carga el nombre del rol si estamos editando
    } else {
      setNombreZona(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, roll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el rol
      console.log("Editando Zona:", nombreZona);
    } else {
      // Lógica para crear un nuevo rol
      console.log("Creando Nueva Zona:", nombreZona);
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Zona" : "Crear Zona"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreZona">
            <Form.Label>Nombre de la zona</Form.Label>
            <Form.Control
              type="text"
              value={nombreZona}
              onChange={(e) => setNombreZona(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Zona"}
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

export default FormZona;
