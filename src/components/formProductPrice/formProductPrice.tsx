import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllProducts, Product, productPrice } from "../../servicios/products";
import { getAllTypePrices, TypePrices } from "../../servicios/TypePrices";

interface FormAddsProps {
  show: boolean;
  handleClose: () => void;
  selectedPrice: productPrice | null; // Usamos productPrice aquí
  isEditing: boolean;
  onSubmit: (price: number, priceDeadHour: number) => Promise<void>;  // Cambiado a dos parámetros
}


const FormProductPrice: React.FC<FormAddsProps> = ({
  show,
  handleClose,
  selectedPrice,
  isEditing,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<productPrice>({
    id: "",
    name: "",
    hour: "",
    price: 0,
    priceDeadHour: 0,
    typePrice: "",
  });

  const [products, setProducts] = useState<Array<Product>>([]);
  const [typePrices, setTypePrices] = useState<Array<TypePrices>>([]);

  useEffect(() => {
    const fetchProductsAndZones = async () => {
      try {
        const [fetchedProducts, fetchedTypePrices] = await Promise.all([
          getAllProducts(),
          getAllTypePrices()
        ]);
        setProducts(fetchedProducts);
        setTypePrices(fetchedTypePrices);
      } catch (error) {
        console.error("Error al obtener productos o zonas:", error);
      }
    };

    fetchProductsAndZones();
  }, []);

  useEffect(() => {
    if (selectedPrice) {
      setFormData(selectedPrice);
    } else {
      setFormData({ id: "", name: "", hour: "", price: 0, priceDeadHour: 0 , typePrice: ""});
    }
  }, [selectedPrice]);

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
    if (isEditing) {
      // Enviar solo los campos necesarios para actualizar
      onSubmit(formData.price, formData.priceDeadHour);
    } else {
      // Enviar solo los campos necesarios para crear
      onSubmit(formData.price, formData.priceDeadHour);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Precio del Producto" : "Crear Precio del Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProducto">
            <Form.Label>Producto</Form.Label>
            <Form.Select
              name="idProduct"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={isEditing} // Disable if in edit mode
            >
              <option value="" disabled>
                Seleccione un producto
              </option>
              {products.map((product) => (
                <option key={product.name} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formTypePrice">
            <Form.Label>Tipo de precio</Form.Label>
            <Form.Select
              name="idTypePrice"
              value={formData.typePrice || ""}
              onChange={handleChange}
              disabled={isEditing} // Disable if in edit mode
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

          <Form.Group controlId="formHour">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="string"
              name="hour"
              placeholder="Ingrese la hora"
              value={formData.hour}
              onChange={handleChange}
              disabled={isEditing} // Disable if in edit mode
            />
          </Form.Group>

          <Form.Group controlId="formPrecio">
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

          <Form.Group controlId="formPrecioHoraMuerta">
            <Form.Label>Precio por Hora Muerta</Form.Label>
            <Form.Control
              type="number"
              name="priceDeadHour"
              placeholder="Ingrese el precio por hora muerta"
              value={formData.priceDeadHour}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar Precio" : "Crear Precio"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormProductPrice;
