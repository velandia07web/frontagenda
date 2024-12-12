import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Adds } from "../../servicios/Adds";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import "./formAdds.css";

interface FormAddsProps {
  show: boolean;
  handleClose: () => void;
  selectedAdd: Adds | null;
  isEditing: boolean;
  onSubmit: (add: Adds) => Promise<void>;
}

const FormAdds: React.FC<FormAddsProps> = ({
  show,
  handleClose,
  selectedAdd,
  isEditing,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Adds>({
    id: "",
    name: "",
    price: 0,
    idTypePrice: "",
  });

  const [typePrices, setTypePrices] = useState<TypePrices[]>([]);

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

  useEffect(() => {
    if (selectedAdd) {
      setFormData(selectedAdd);
    } else {
      setFormData({ id: "", name: "", price: 0, idTypePrice: "" });
    }
  }, [selectedAdd]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Adicional" : "Crear Adicional"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombreAdicional">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ingrese el nombre del adicional"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPrecioAdicional">
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

          <Form.Group controlId="formTipoPrecio">
            <Form.Label>Tipo de Precio</Form.Label>
            <Form.Select
              name="idTypePrice"
              value={formData.idTypePrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, idTypePrice: e.target.value }))
              }
              required
            >
              <option value="" disabled>
                Seleccione un tipo de precio
              </option>
              {typePrices.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar Adicional" : "Crear Adicional"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormAdds;
