import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllTypeDocuments, TypeDocument } from "../../servicios/TypeDocuments";
import "bootstrap/dist/css/bootstrap.min.css";
import { Company } from "../../servicios/Company";
import { PaymentDates, getAllPaymentDates } from "../../servicios/PaymentsDates";

interface FormCompaniesProps {
  show: boolean;
  handleClose: () => void;
  companyData?: Company; // Datos de la empresa si se quiere editar
  onSave: (newCompany: Company) => void; // Callback para refrescar la lista tras crear/editar
}

const FormCompanies: React.FC<FormCompaniesProps> = ({ show, handleClose, companyData, onSave }) => {
  const [TypeDocuments, setTypeDocuments] = useState<Array<TypeDocument>>([])
  const [PaymentsDate, setPaymentsDate] = useState<Array<PaymentDates>>([])
  const [formData, setFormData] = useState<Company>({
    name: "",
    legalName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
    cupo: 0,
    numberDocument: "",
    idTypeDocument: "",
    typePayment: "",
    idPaymentsDate: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const TypeDocumentData = await getAllTypeDocuments()
        const PaymentsDateData = await getAllPaymentDates()
        setPaymentsDate(PaymentsDateData)
        setTypeDocuments(TypeDocumentData)
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    }

    fetchData()
    if (companyData) {
      setFormData(companyData);
    } else {
      resetForm(); // Si no hay empresa, limpiamos el formulario
    }
  }, [companyData]);

  const resetForm = () => {
    setFormData({
      name: "",
      legalName: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      industry: "",
      cupo: 0,
      numberDocument: "",
      idTypeDocument: "",
      typePayment: "",
      idPaymentsDate: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "typePayment" && value !== "Cuotas" ? { cupoDisponible: 0 } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      onSave(formData); // Pasa 'formData' para refrescar la lista de empresas
      handleClose(); // Cierra el modal
      resetForm(); // Limpia el formulario
    } catch (error) {
      alert("Ocurrió un error al guardar la empresa.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Editar Empresa" : "Crear Empresa"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} id="form">
          <Form.Group controlId="formName">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese el nombre comercial"
              required
            />
          </Form.Group>

          <Form.Group controlId="formLegalName">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              placeholder="Ingrese la razón social"
              required
            />
          </Form.Group>

          <Form.Group controlId="formTypeDocument">
            <Form.Label>Tipo de documento</Form.Label>
            <Form.Control
              as="select"
              name="idTypeDocument"
              value={formData.idTypeDocument}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Ciudad</option>
              {TypeDocuments.map((document) => (
                <option key={document.id} value={document.id}>
                  {document.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formNumberDocument">
            <Form.Label>Número de documento</Form.Label>
            <Form.Control
              type="text"
              name="numberDocument"
              value={formData.numberDocument}
              onChange={handleChange}
              placeholder="Ingrese el número de documento"
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico"
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ingrese el teléfono"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ingrese la dirección"
              required
            />
          </Form.Group>

          <Form.Group controlId="formWebsite">
            <Form.Label>Sitio Web</Form.Label>
            <Form.Control
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Ingrese el sitio web"
            />
          </Form.Group>

          <Form.Group controlId="formIndustry">
            <Form.Label>Industria</Form.Label>
            <Form.Control
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Ingrese el sector de la industria"
              required
            />
          </Form.Group>

          <Form.Group controlId="formTypePayment">
            <Form.Label>Tipo de pago</Form.Label>
            <Form.Control
              as="select"
              name="typePayment"
              value={formData.typePayment}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de pago</option>
              <option key={"Contado"} value={"Contado"}>
                Contado
              </option>
              <option key={"Cuotas"} value={"Cuotas"}>
                Cuotas
              </option>
            </Form.Control>
          </Form.Group>
          {formData.typePayment === "Cuotas" && (


            <Form.Group controlId="formCupoDisponible">
              <Form.Label>Cupo disponible</Form.Label>
              <Form.Control
                type="number"
                name="cupo"
                value={formData.cupo}
                onChange={handleChange}
                placeholder="Ingrese el cupo disponible"
              />
            </Form.Group>
          )}
          {/* Mostrar campo de idPaymentsDate solo si se selecciona "Cuotas" */}
          {formData.typePayment === "Cuotas" && (
            <Form.Group controlId="formPaymentsDate">
              <Form.Label>Fecha de pago</Form.Label>
              <Form.Control
                as="select"
                name="idPaymentsDate"
                value={formData.idPaymentsDate}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Fecha de Pago</option>
                {PaymentsDate.map((payment) => (
                  <option key={payment.id} value={payment.id}>
                    {payment.numberDays + "Días"}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" type="submit">
              {formData.id ? "Actualizar Empresa" : "Crear Empresa"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormCompanies;
