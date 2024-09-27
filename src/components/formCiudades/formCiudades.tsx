import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { City } from "../../servicios/city";
import { getAllZones } from "../../servicios/zone";
import { Zone } from "../../servicios/zone";

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
    idZone: "", // Cambiado a string
  });

  const [zonas, setZonas] = useState<Zone[]>([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await getAllZones();
        console.log("Zonas obtenidas:", zones); // Para depurar
        setZonas(zones);
      } catch (error) {
        console.error("Error al obtener zonas:", error);
      }
    };

    fetchZones();

    if (selectedCiudad) {
      setCiudadData(selectedCiudad);
    } else {
      setCiudadData({ id: "", name: "", idZone: "" }); // Cambiado a string
    }
  }, [selectedCiudad]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    console.log("Nombre:", name, "Valor:", value); // Para depurar

    setCiudadData((prev) => ({
      ...prev,
      [name]: name === "idZone" ? value : value, // No necesitas convertir a número, ya que idZone es un string
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(ciudadData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Ciudad" : "Crear Ciudad"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCityName">
            <Form.Label>Nombre de la Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la ciudad"
              name="name"
              value={ciudadData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCityZone">
            <Form.Label>Zona</Form.Label>
            <Form.Control
              as="select"
              name="idZone"
              value={ciudadData.idZone} // Asegúrate de que sea un string
              onChange={handleChange}
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
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormCiudad;
