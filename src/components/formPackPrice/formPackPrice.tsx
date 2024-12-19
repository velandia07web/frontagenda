import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { PricePackJustHour } from "../../servicios/PricesPacks";

interface FormPackPriceProps {
  show: boolean;
  handleClose: () => void;
  selectedPricePack: PricePackJustHour | null; // Cambiado a PricePackJustHour
  isEditing: boolean;
  onSubmit: (price: number, priceDeadHour: number) => Promise<void>;
}

const FormPackPrice: React.FC<FormPackPriceProps> = ({
  show,
  handleClose,
  selectedPricePack,
  isEditing,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PricePackJustHour>({
    price: 0,
    priceDeadHour: 0,
  });

  // Configurar el formulario si hay un paquete seleccionado
  useEffect(() => {
    if (selectedPricePack) {
      setFormData({
        price: selectedPricePack.price,
        priceDeadHour: selectedPricePack.priceDeadHour,
      });
    } else {
      setFormData({
        price: 0,
        priceDeadHour: 0,
      });
    }
  }, [selectedPricePack]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función de envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(formData.price), Number(formData.priceDeadHour));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Precio del Paquete" : "Crear Precio del Paquete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPrecio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder="Ingrese el precio"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPrecioHoraMuerta">
            <Form.Label>Precio por Hora Muerta</Form.Label>
            <Form.Control
              type="number"
              name="priceDeadHour"
              placeholder="Ingrese el precio por hora muerta"
              value={formData.priceDeadHour}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar Precio" : "Crear Precio"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormPackPrice;
