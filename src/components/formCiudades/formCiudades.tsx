import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FormCiudadProps {
  show: boolean;
  handleClose: () => void;
  ciudad: { nombreCiudad: string; nombreZona: string } | null; // El rol seleccionado, o null si es un nuevo rol
  isEditing: boolean; // Si estamos en modo edición o no
}

const FormCiudad: React.FC<FormCiudadProps> = ({
  show,
  handleClose,
  ciudad,
  isEditing,
}) => {
  const [nombreZona, setNombreZona] = useState("");
  const [nombreCiudad, setNombreCiudad] = useState("");

  // Si estamos en modo edición y el rol existe, llenamos el formulario con los datos actuales
  useEffect(() => {
    if (isEditing && ciudad) {
      setNombreCiudad(ciudad.nombreCiudad);
      setNombreZona(ciudad.nombreZona); // Carga el nombre del rol si estamos editando
    } else {
      setNombreCiudad("");
      setNombreZona(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, ciudad]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para actualizar el rol
      console.log("Editando Ciudad:", nombreCiudad, nombreZona);
    } else {
      // Lógica para crear un nuevo rol
      console.log("Creando nuevo Ciudad:", nombreCiudad, nombreZona);
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Ciudad" : "Crear Ciudad"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreZona">
            <Form.Label>Nombre de la Zona</Form.Label>
            <Form.Control
              type="text"
              value={nombreZona}
              onChange={(e) => setNombreZona(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="nombreCiudad">
            <Form.Label>Nombre del Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={nombreCiudad}
              onChange={(e) => setNombreCiudad(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear ciudad"}
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

export default FormCiudad;
