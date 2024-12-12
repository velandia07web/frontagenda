import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import { QuotationsResume } from "../../servicios/quotations";
import { sendEmail, inactiveQuotation } from "../../servicios/quotations";
interface FormQuotationsProps {
  show: boolean;
  handleClose: () => void;
  quotation: QuotationsResume;
}

const ResumeQuotations: React.FC<FormQuotationsProps> = ({
  show,
  handleClose,
  quotation,
}) => {
  const [typePrices, setTypePrices] = useState<TypePrices[]>([]);
  const navigate = useNavigate(); // Hook para navegación

  const sendEmailHandler = (id: string) => {
    try {
      sendEmail(id); // La función importada
      navigate("/Cotizacion")
    } catch (error) {
      console.log(error);
    }
  };

  const inactiveQuotitationHandler = (id: string) => {
    try {
      inactiveQuotation(id)
      navigate("/Cotizacion")
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchTypePrices = async () => {
      try {
        const fetchedTypePrices = await getAllTypePrices();
        setTypePrices(fetchedTypePrices);
      } catch (error) {
        console.error("Error al obtener tipos de precios:", error);
      }
    };

    fetchTypePrices();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de Cotización</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formReferencia">
            <Form.Label>Referencia</Form.Label>
            <Form.Control
              type="text"
              value={quotation.reference}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formCliente">
            <Form.Label>ID del Cliente</Form.Label>
            <Form.Control
              type="text"
              value={quotation.clientId}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={quotation.telephone}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formCorreo">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              value={quotation.email}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formRedesSociales">
            <Form.Label>ID de Redes Sociales</Form.Label>
            <Form.Control
              type="text"
              value={quotation.SocialMediasId}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formTipoPrecio">
            <Form.Label>Tipo de Precio</Form.Label>
            <Form.Control
              as="select"
              value={quotation.typePricesId}
              disabled

            >
              {typePrices.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDescuento">
            <Form.Label>Descuento</Form.Label>
            <Form.Control
              type="number"
              value={quotation.discount}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formSubtotal">
            <Form.Label>Subtotal</Form.Label>
            <Form.Control
              type="number"
              value={quotation.subtotal}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formIVA">
            <Form.Label>IVA</Form.Label>
            <Form.Control
              type="number"
              value={quotation.IVA}
              disabled

            />
          </Form.Group>

          <Form.Group controlId="formTotalNeto">
            <Form.Label>Total Neto</Form.Label>
            <Form.Control
              type="number"
              value={quotation.totalNet}
              disabled
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>.
      <Button variant="secondary" onClick={() => sendEmailHandler(quotation.id || "")}>
        Enviar correo
      </Button>
        <Button variant="secondary" onClick={() => inactiveQuotitationHandler(quotation.id || "")}>
          Desactivar cotización
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResumeQuotations;
