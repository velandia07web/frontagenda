import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Packs } from "../../servicios/Packs"; // Asegúrate de que el archivo correcto esté importado
import { getAllProducts, Product } from "../../servicios/products";
import { getAllZones, Zone } from "../../servicios/zone";

interface FormAddsProps {
  show: boolean;
  handleClose: () => void;
  selectedPack: Packs | null;
  isEditing: boolean;
  onSubmit: (pack: Packs) => Promise<void>;
}

const FormPacks: React.FC<FormAddsProps> = ({
  show,
  handleClose,
  selectedPack,
  isEditing,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Packs>({
    id: "",
    name: "",
    description: "",
    idProduct: "",
    idZone: "",
  });

  const [products, setProducts] = useState<Array<Product>>([]); 
  const [zones, setZones] = useState<Array<Zone>>([]); 

  useEffect(() => {
    const fetchProductsAndZones = async () => {
      try {
        const [fetchedProducts, fetchedZones] = await Promise.all([
          getAllProducts(),
          getAllZones(),
        ]);
        setProducts(fetchedProducts);
        setZones(fetchedZones);
      } catch (error) {
        console.error("Error al obtener productos o zonas:", error);
      }
    };

    fetchProductsAndZones();
  }, []);

  useEffect(() => {
    if (selectedPack) {
      setFormData(selectedPack);
    } else {
      setFormData({ id: "", name: "", description: "", idProduct: "", idZone: "" });
    }
  }, [selectedPack]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          {isEditing ? "Editar Paquete" : "Crear Paquete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombrePaquete">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ingrese el nombre del paquete"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDescripcionPaquete">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="description"
              placeholder="Ingrese la descripción"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formProducto">
            <Form.Label>Producto</Form.Label>
            <Form.Select
              name="idProduct"
              value={formData.idProduct || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccione un producto
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formZona">
            <Form.Label>Zona</Form.Label>
            <Form.Select
              name="idZone"
              value={formData.idZone || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccione una zona
              </option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar Paquete" : "Crear Paquete"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormPacks;
