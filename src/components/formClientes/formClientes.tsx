import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Client, createClient, updateClient } from "../../servicios/clients";
import { SocialMedia, getAllSocialMedias } from "../../servicios/socialMedia";
import { TypeDocument, getAllTypeDocuments } from "../../servicios/TypeDocuments";
import { TypeClient, getAllTypeClients } from "../../servicios/TypeClients";
import { getAllCompanies, Company } from "../../servicios/Company";
import "bootstrap/dist/css/bootstrap.min.css";

interface FormClientesProps {
  show: boolean;
  handleClose: () => void;
  clientData?: Client; // Datos del cliente si se quiere editar
  onSave: (newClient: Client) => void; // Callback para refrescar la lista tras crear/editar
}


const FormClientes: React.FC<FormClientesProps> = ({ show, handleClose, clientData, onSave }) => {
  const [socialMedia, setSocialMedia] = useState<Array<SocialMedia>>([])
  const [TypeDocument, setTypeDocument] = useState<Array<TypeDocument>>([])
  const [TypeClient, setTypeClient] = useState<Array<TypeClient>>([])
  const [companies, setCompanies] = useState<Array<Company>>([])
  const [_selectedTypeClient, setSelectedTypeClient] = useState<string>("");
  const [formData, setFormData] = useState<Client>({
    name: "",
    lastName: "",
    CC: "",
    idSocialMedia: "",
    idTypeDocument: "",
    numberDocument: "",
    email: "",
    idCompany: "",
    celphone: "",
    charge: "",
    cupoDisponible: 0,
    cupoCopado: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const socialMediaData = await getAllSocialMedias();
        const TypeDocumentData = await getAllTypeDocuments();
        const TypeClientData = await getAllTypeClients()
        const companiesData = await getAllCompanies();
        setSocialMedia(socialMediaData)
        setTypeDocument(TypeDocumentData)
        setTypeClient(TypeClientData)
        setCompanies(companiesData)
      } catch (error) {
        console.error('Hubo un error al traer todas las redes sociales: ', error)
      }
    }

    fetchData()
  }, [])


  useEffect(() => {
    // Si recibimos datos del cliente, los colocamos en el formulario para editar
    if (clientData) {
      setFormData(clientData);
      setSelectedTypeClient(clientData.idTypeDocument || "");
    } else {
      resetForm(); // Si no hay cliente, limpiamos el formulario
    }
  }, [clientData]);

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      CC: "",
      idSocialMedia: "",
      idTypeDocument: "",
      numberDocument: "",
      email: "",
      idCompany: "",
      celphone: "",
      charge: "",
      cupoDisponible: 0,
      cupoCopado: 0
    });
    setSelectedTypeClient("");
  };

  const resetFormFields = (newTypeClient: string) => {
    // Encontrar el nombre del tipo de cliente basado en el ID
    const selectedType = TypeClient.find((item) => item.id === newTypeClient)?.name;
  
    if (selectedType === "Empresa") {
      // Limpiar campos relacionados con Persona Natural
      setFormData((prev) => ({
        ...prev,
        name: "",
        lastName: "",
        CC: "",
        company: prev.idCompany, // Conservar valores de empresa si los tiene
      }));
    } else if (selectedType === "Persona Natural") {
      // Limpiar campos relacionados con Empresa
      setFormData((prev) => ({
        ...prev,
        company: "",
        idTypeDocument: "",
        numberDocument: "",
        name: prev.name, // Conservar valores de persona si los tiene
        lastName: prev.lastName,
        CC: prev.CC,
      }));
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    // Si el cambio es en el tipo de cliente
    if (name === "idTypeClient") {
      // Resetear campos específicos al cambiar entre "Empresa" y "Persona Natural"
      resetFormFields(value);
    }
  
    // Actualizar el estado general del formulario
    setFormData({ ...formData, [name]: value });
  };
  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Si hay un ID, actualizamos (PUT)
        await updateClient(formData.id, formData);

        alert("Cliente actualizado correctamente");
      } else {
        // Si no hay ID, creamos (POST)
        await createClient(formData);
        alert("Cliente creado correctamente");
      }
      onSave(formData); // Pasa 'formData' para refrescar la lista de clientes
      handleClose(); // Cierra el modal
      resetForm(); // Limpia el formulario
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      alert("Ocurrió un error al guardar el cliente.");
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Editar Cliente" : "Crear Cliente"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} id="form">
          <Form.Group controlId="formSocialMedia">
            <Form.Label>¿Por donde fue contactado?</Form.Label>
            <Form.Control
              as="select"
              name="idSocialMedia"
              value={formData.idSocialMedia}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Referencia</option>
              {socialMedia.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formTypeClient">
            <Form.Label>Tipo de cliente</Form.Label>
            <Form.Control
              as="select"
              name="idTypeClient" // Corregido para usar la propiedad correcta
              value={formData.idTypeClient}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Tipo de Cliente</option>
              {TypeClient.map((tipoCliente) => (
                <option key={tipoCliente.id} value={tipoCliente.id}>
                  {tipoCliente.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>


          {/* Mapeo del ID para obtener el nombre */}
          {(() => {
            const selectedClientType = TypeClient.find(
              (item) => item.id === formData.idTypeClient // Usar idTypeClient
            )?.name;

            if (selectedClientType === "Empresa") {
              return (
                <>
                <Form.Group controlId="formName">
                    <Form.Label>Nombre de la persona a cargo</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre del cliente"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Apellido de la persona a cargo</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ingrese el apellido del cliente"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formCC">
                    <Form.Label>Cédula de la persona a cargo</Form.Label>
                    <Form.Control
                      type="text"
                      name="CC"
                      value={formData.CC}
                      onChange={handleChange}
                      placeholder="Ingrese el número de cédula"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formidCompany">
                    <Form.Label>Empresa</Form.Label>
                    <Form.Control
                      as="select"
                      name="idCompany"
                      value={formData.idCompany}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Ingrese la empresa del cliente</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formIdTypeDocument">
                    <Form.Label>Tipo de documento de la empresa</Form.Label>
                    <Form.Control
                      as="select"
                      name="idTypeDocument"
                      value={formData.idTypeDocument}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar Tipo de Documento</option>
                      {TypeDocument.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formNumberDocument">
                    <Form.Label>Número de Documento de la empresa</Form.Label>
                    <Form.Control
                      type="text"
                      name="numberDocument"
                      value={formData.numberDocument}
                      onChange={handleChange}
                      placeholder="Ingrese el número de documento"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formCharge">
                    <Form.Label>Cargo en la empresa</Form.Label>
                    <Form.Control
                      type="text"
                      name="charge"
                      value={formData.charge}
                      onChange={handleChange}
                      placeholder="Ingrese su cargo"
                      required
                    />
                  </Form.Group>
                </>
              );
            } else if (selectedClientType === "Persona Natural") {
              return (
                <>
                  <Form.Group controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre del cliente"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ingrese el apellido del cliente"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="formIdTypeDocument">
                    <Form.Label>Tipo de documento</Form.Label>
                    <Form.Control
                      as="select"
                      name="idTypeDocument"
                      value={formData.idTypeDocument}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar Tipo de Documento</option>
                      {TypeDocument.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formNumberDocument">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      type="text"
                      name="numberDocument"
                      value={formData.numberDocument}
                      onChange={handleChange}
                      placeholder="Ingrese el número de documento"
                      required
                    />
                  </Form.Group>
                </>
              );
            }
            return null; // Si no hay tipo de cliente seleccionado
          })()}


          {/* Campos comunes */}
          <Form.Group controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico del cliente"
              required
            />
          </Form.Group>

          <Form.Group controlId="formCelphone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="celphone"
              value={formData.celphone}
              onChange={handleChange}
              placeholder="Ingrese el teléfono del cliente"
            />
          </Form.Group>

          <Form.Group controlId="formCupoDisponible">
            <Form.Label>Cupo disponible</Form.Label>
            <Form.Control
              type="number"
              name="cupoDisponible" // Cambiado a la propiedad correcta
              value={formData.cupoDisponible}
              onChange={handleChange}
              placeholder="Ingrese el cupo disponible"
            />
          </Form.Group>


          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" type="submit">
              {formData.id ? "Actualizar Cliente" : "Crear Cliente"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};


export default FormClientes;
