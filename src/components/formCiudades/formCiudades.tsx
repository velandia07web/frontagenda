import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar el CSS de Bootstrap

interface FormCiudadesProps {
  show: boolean;
  handleClose: () => void;
}

const FormCiudades: React.FC<FormCiudadesProps> = ({ show, handleClose }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Datos de la ciudad ingresados");
    handleClose(); // Cierra el modal después de enviar
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Formulario de Ciudades</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCityName">
            <Form.Label>Nombre de la Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la ciudad"
              required
            />
          </Form.Group>

          <Form.Group controlId="formCityCountry">
            <Form.Label>País</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el país" required />
          </Form.Group>

          <Form.Group controlId="formCityPopulation">
            <Form.Label>Población</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese la población de la ciudad"
            />
          </Form.Group>

          <Form.Group controlId="formCityRegion">
            <Form.Label>Región</Form.Label>
            <Form.Control type="text" placeholder="Ingrese la región" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormCiudades;
