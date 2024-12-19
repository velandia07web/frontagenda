import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { City } from "../../servicios/city";
import { getAllZones } from "../../servicios/zone";
import { Zone } from "../../servicios/zone";
import "./formCiudades.css"; // Archivo de estilos personalizado

interface FormCiudadProps {
  show: boolean;
  handleClose: () => void;
  selectedCiudad: City | null;
  isEditing: boolean;
  onSubmit: (ciudad: City) => Promise<void>;
}

const FormCiudad: React.FC<FormCiudadProps> = ({
  show,
  handleClose,
  selectedCiudad,
  isEditing,
  onSubmit,
}) => {
  const [ciudadData, setCiudadData] = useState<City>({
    id: "",
    name: "",
    idZone: "",
    transportPrice: 0,
  });

  const [zonas, setZonas] = useState<Zone[]>([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await getAllZones();
        setZonas(zones);
      } catch (error) {
        console.error("Error al obtener zonas:", error);
      }
    };

    fetchZones();

    if (selectedCiudad) {
      setCiudadData(selectedCiudad);
    } else {
      setCiudadData({ id: "", name: "", idZone: "", transportPrice: 0 });
    }
  }, [selectedCiudad]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCiudadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(ciudadData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-custom">
          {isEditing ? "Editar Ciudad" : "Crear Ciudad"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCityName" className="mb-4">
            <Form.Label className="form-label-custom">
              Nombre de la Ciudad
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la ciudad"
              name="name"
              value={ciudadData.name}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </Form.Group>

          <Form.Group controlId="formTransportPrice" className="mb-4">
            <Form.Label className="form-label-custom">
              Costo de transporte
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la ciudad"
              name="transportPrice"
              value={ciudadData.transportPrice}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </Form.Group>

          <Form.Group controlId="formCityZone" className="mb-4">
            <Form.Label className="form-label-custom">Zona</Form.Label>
            <Form.Control
              as="select"
              name="idZone"
              value={ciudadData.idZone}
              onChange={handleChange}
              className="custom-select"
              required
            >
              <option value="">Seleccionar Zona</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Modal.Footer>
            <Button className="custom-btn-secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button className="custom-btn-primary" type="submit">
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormCiudad;
