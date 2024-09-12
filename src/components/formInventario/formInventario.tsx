import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar el CSS de Bootstrap

interface FormInventarioProps {
  show: boolean;
  handleClose: () => void;
}

const FormInventario: React.FC<FormInventarioProps> = ({
  show,
  handleClose,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Datos del inventario ingresados");
    handleClose(); // Cierra el modal después de enviar
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Formulario de Inventario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formItemName">
            <Form.Label>Nombre del Artículo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del artículo"
              required
            />
          </Form.Group>

          <Form.Group controlId="formItemCategory">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la categoría"
              required
            />
          </Form.Group>

          <Form.Group controlId="formItemQuantity">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese la cantidad"
              required
            />
          </Form.Group>

          <Form.Group controlId="formItemPrice">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Ingrese el precio"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormInventario;
