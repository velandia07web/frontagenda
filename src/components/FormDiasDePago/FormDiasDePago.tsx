import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./FormDiasDePago.css";
import { PaymentDates } from "../../servicios/PaymentsDates";

interface FormPaymentDatesProps {
  show: boolean;
  handleClose: () => void;
  selectedPaymentDate: PaymentDates | null; // Cambia 'SocialMedia' a 'PaymentDates'
  isEditing: boolean;
  onSubmit: (paymentDate: PaymentDates) => Promise<void>; // Cambia 'SocialMedia' a 'PaymentDates'
}

const FormPaymentDates: React.FC<FormPaymentDatesProps> = ({
  show,
  handleClose,
  selectedPaymentDate,
  isEditing,
  onSubmit,
}) => {
  const [numberDays, setNumberDays] = useState<number>(0); // Propiedad específica para PaymentDates

  useEffect(() => {
    if (isEditing && selectedPaymentDate) {
      setNumberDays(selectedPaymentDate.numberDays); // Configura los días si se edita
    } else {
      setNumberDays(0); // Resetea el formulario si estamos creando
    }
  }, [isEditing, selectedPaymentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ numberDays }); // Asegúrate de pasar el objeto con 'numberDays'
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Días de Pago" : "Crear Días de Pago"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="numberDays">
            <Form.Label>Número de Días</Form.Label>
            <Form.Control
              type="number"
              value={numberDays} // Ajusta el input para 'numberDays'
              onChange={(e) => setNumberDays(Number(e.target.value))}
              required
              min={1} // Asegúrate de que sea mayor a 0
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
              {isEditing ? "Guardar Cambios" : "Crear"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormPaymentDates;
