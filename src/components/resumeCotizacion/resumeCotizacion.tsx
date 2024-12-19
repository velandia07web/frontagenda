import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import { sendEmail, inactiveQuotation } from "../../servicios/quotations";
interface FormQuotationsProps {
  show: boolean;
  handleClose: () => void;
  idQuotation: string;
}

const ResumeQuotations: React.FC<FormQuotationsProps> = ({
  show,
  handleClose,
  idQuotation,
}) => {
  const navigate = useNavigate(); // Hook para navegación

  const sendEmailHandler = (id: string) => {
    try {
      sendEmail(id); // La función importada
      navigate("/cotizaciones")
    } catch (error) {
      console.log(error);
    }
  };

  const inactiveQuotitationHandler = (id: string) => {
    try {
      inactiveQuotation(id)
      navigate("/cotizaciones")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de Cotización</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
      <Button variant="secondary" onClick={() => sendEmailHandler(idQuotation)}>
        Enviar correo con la cotizacion
      </Button>
        <Button variant="secondary" onClick={() => inactiveQuotitationHandler(idQuotation)}>
          Desactivar cotización
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResumeQuotations;
