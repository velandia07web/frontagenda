import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Product } from "../../servicios/products";
import { getAllZones, Zone } from "../../servicios/zone";
import "./formProductos.css"; // Archivo de estilos personalizado

interface FormProductoProps {
  show: boolean;
  handleClose: () => void;
  selectedProducto: Product | null;
  isEditing: boolean;
  onSubmit: (producto: Product) => Promise<void>;
}

const FormProducto: React.FC<FormProductoProps> = ({
  show,
  handleClose,
  selectedProducto,
  isEditing,
  onSubmit,
}) => {
  const [name, setName] = useState<string>(selectedProducto?.name || "");
  const [imagen, setImagen] = useState<string>(selectedProducto?.imagen || "");
  const [description, setDescription] = useState<string>(
    selectedProducto?.description || ""
  );
  const [count, setCount] = useState<number>(selectedProducto?.count || 0);
  const [idZone, setIdZone] = useState<string>(selectedProducto?.idZone || "");
  const [zonas, setZonas] = useState<Zone[]>([]);

  const fetchZones = async () => {
    try {
      const fetchedZones = await getAllZones();
      setZonas(fetchedZones);
    } catch (error) {
      console.error("Error al obtener zonas:", error);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedProducto) {
      setName(selectedProducto.name);
      setImagen(selectedProducto.imagen);
      setDescription(selectedProducto.description);
      setCount(selectedProducto.count);
      setIdZone(selectedProducto.idZone);
    }
  }, [selectedProducto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const producto: Product = {
      id: selectedProducto?.id || "", // id opcional
      name,
      imagen,
      description,
      count,
      idZone,
    };
    onSubmit(producto);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Producto" : "Crear Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombreProducto">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formImagenProducto">
            <Form.Label>URL de la imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la URL de la imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDescripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese una descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCantidadProducto">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese la cantidad"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group controlId="formZonaProducto">
            <Form.Label>Zona</Form.Label>
            <Form.Control
              as="select"
              value={idZone}
              onChange={(e) => setIdZone(e.target.value)}
              required
            >
              <option value="">Seleccione una zona</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormProducto;
