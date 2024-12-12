import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Company } from "../../servicios/Company";

interface FormCompaniesProps {
  show: boolean;
  handleClose: () => void;
  companyData?: Company; // Datos de la empresa si se quiere editar
  onSave: (newCompany: Company) => void; // Callback para refrescar la lista tras crear/editar
}

const FormCompanies: React.FC<FormCompaniesProps> = ({ show, handleClose, companyData, onSave }) => {
  const [formData, setFormData] = useState<Company>({
    name: "",
    legalName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
  });

  useEffect(() => {
    if (companyData) {
      // Si recibimos datos de la empresa, los colocamos en el formulario para editar
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
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Si hay un ID, actualizamos (PUT)
        // Aquí deberías integrar tu lógica para actualizar la empresa en el backend
        alert("Empresa actualizada correctamente");
      } else {
        // Si no hay ID, creamos (POST)
        // Aquí deberías integrar tu lógica para crear una nueva empresa en el backend
        alert("Empresa creada correctamente");
      }
      onSave(formData); // Pasa 'formData' para refrescar la lista de empresas
      handleClose(); // Cierra el modal
      resetForm(); // Limpia el formulario
    } catch (error) {
      console.error("Error al guardar la empresa:", error);
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
