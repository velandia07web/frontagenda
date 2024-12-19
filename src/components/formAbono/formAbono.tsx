import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./formAbono.css"; // Asegúrate de tener un archivo CSS actualizado para los estilos personalizados
import { Abono } from "../../servicios/abono";

interface FormAbonoProps {
  show: boolean;
  handleClose: () => void;
  quotationId: string;
  selectedAbono: Abono | null;
  isEditing: boolean;
  onSubmit: (abono: Abono) => Promise<void>;
}

const FormAbono: React.FC<FormAbonoProps> = ({
  show,
  handleClose,
  quotationId,
  selectedAbono,
  isEditing,
  onSubmit,
}) => {
  // Cambiamos el estado a un solo objeto formData
  const [formData, setFormData] = useState<Abono>({
    quotationId: quotationId,
    file: null,
    payment: 0,
  });

  useEffect(() => {
    if (isEditing && selectedAbono) {
      // Si estamos editando, inicializamos el formData con los valores del abono seleccionado
      setFormData({
        quotationId: selectedAbono.quotationId,
        payment: selectedAbono.payment,
        file: selectedAbono.file,
      });
    } else {
      // Si no estamos editando, reseteamos el formulario
      setFormData({
        quotationId: quotationId, // Aseguramos que se mantenga el id de la cotización
        payment: 0,
        file: null,
      });
    }
  }, [isEditing, selectedAbono, quotationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.file) {
      await onSubmit(formData);
      handleClose();
    } else {
      alert("Por favor, adjunta un archivo.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file: selectedFile, // Actualizamos solo el archivo sin cambiar el resto de los datos
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Actualizamos solo el campo modificado
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Abono" : "Crear Abono"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          {/* Campo para el pago */}
          <Form.Group controlId="payment">
            <Form.Label>Monto del Abono</Form.Label>
            <Form.Control
              type="number"
              name="payment" // Campo de formData
              value={formData.payment}
              onChange={handleInputChange}
              required
              size="lg"
              className="custom-input"
            />
          </Form.Group>

          {/* Campo para cargar el archivo */}
          <Form.Group controlId="file">
            <Form.Label>Archivo del Abono</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              required
              className="custom-input"
            />
          </Form.Group>

          {/* Botones para cancelar o enviar el formulario */}
          <div className="d-flex justify-content-between mt-4">
            <Button className="custom-btn-secondary forms" onClick={handleClose}>
              Cancelar
            </Button>
            <Button className="custom-btn-primary form" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Abono"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormAbono;
