import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./formZonas.css"; // Asegúrate de tener un archivo CSS actualizado para los estilos personalizados

interface Zone {
  id: string;
  name: string;
}

interface FormZonaProps {
  show: boolean;
  handleClose: () => void;
  selectedZone: Zone | null;
  isEditing: boolean;
  onSubmit: (zone: Zone) => Promise<void>;
}

const FormZona: React.FC<FormZonaProps> = ({
  show,
  handleClose,
  selectedZone,
  isEditing,
  onSubmit,
}) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (isEditing && selectedZone) {
      setName(selectedZone.name); // Seteamos el nombre de la zona seleccionada
    } else {
      setName(""); // Reseteamos el formulario al crear una nueva zona
    }
  }, [isEditing, selectedZone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ id: selectedZone?.id || "", name });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Zona" : "Crear Zona"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreZona">
            <Form.Label>Nombre de la Zona</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="lg" // Se asegura de que el input tenga un tamaño adecuado
              className="custom-input" // Aplica una clase personalizada
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
              {isEditing ? "Guardar Cambios" : "Crear Zona"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormZona;
