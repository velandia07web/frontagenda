import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Zone } from "../../servicios/zone"; // Importa la interfaz de Zone

interface FormZonaProps {
  show: boolean;
  handleClose: () => void;
  selectedZone: Zone | null; // Zona seleccionada o null
  isEditing: boolean; // Bandera para saber si es edición
  onSubmit: (zone: Zone) => Promise<void>; // Función para enviar el formulario
}

const FormZona: React.FC<FormZonaProps> = ({
  show,
  handleClose,
  selectedZone,
  isEditing,
  onSubmit,
}) => {
  // Estado inicial para los datos del formulario
  const [zoneData, setZoneData] = useState<Zone>({ name: "" });

  // Efecto que se ejecuta cada vez que cambia la zona seleccionada
  useEffect(() => {
    if (selectedZone) {
      setZoneData(selectedZone); // Si estamos editando, establece los datos en el formulario
    } else {
      setZoneData({ name: "" }); // Si no, reinicia el formulario para crear
    }
  }, [selectedZone]);

  // Maneja el cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZoneData((prev) => ({ ...prev, [name]: value }));
  };

  // Envía el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(zoneData); // Llama a la función onSubmit proporcionada
    handleClose(); // Cierra el modal al terminar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Zona" : "Crear Zona"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreZona">
            <Form.Label>Nombre de la Zona</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={zoneData.name} // El valor se actualiza con el estado zoneData
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormZona;
