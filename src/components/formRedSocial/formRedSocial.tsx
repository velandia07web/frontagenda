import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./formRedSocial.css";

interface SocialMedia {
  name: string; // Definir la propiedad 'name' en lugar de 'nombreRed'
}

interface FormSocialProps {
  show: boolean;
  handleClose: () => void;
  selectedSocial: SocialMedia | null; // Cambia 'roll' a 'selectedSocial'
  isEditing: boolean;
  onSubmit: (socialMedia: SocialMedia) => Promise<void>; // Cambia el nombre de la función
}

const FormRedSocial: React.FC<FormSocialProps> = ({
  show,
  handleClose,
  selectedSocial,
  isEditing,
  onSubmit,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isEditing && selectedSocial) {
      setName(selectedSocial.name); // Cambia 'nombreRed' a 'name'
    } else {
      setName(""); // Resetea el formulario si estamos creando
    }
  }, [isEditing, selectedSocial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name }); // Asegúrate de pasar el objeto con la propiedad 'name'
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Red Social" : "Crear Red Social"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreRed">
            <Form.Label>Nombre de Red</Form.Label>
            <Form.Control
              type="text"
              value={name} // Cambia 'nombreRed' a 'name'
              onChange={(e) => setName(e.target.value)}
              required
              size="lg" // Tamaño del input más grande
            />
          </Form.Group>
          <div className="d-flex justify-content-between mt-4">
            <Button
              className="custom-btn-secondary forms"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button className="custom-btn-primary form" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Red"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormRedSocial;
