import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { productAditional, Adds, getAllAdds } from "../../servicios/Adds";
import "bootstrap/dist/css/bootstrap.min.css";

interface FormEvents {
    show: boolean;
    handleClose: () => void;
    onSaveProductAditional: (productAditional: productAditional) => void;
}

const FormProductoAdicionalModal: React.FC<FormEvents> = ({ show, handleClose, onSaveProductAditional }) => {
    const [adds, setAdds] = useState<Array<Adds>>([]);
    const [formData, setFormData] = useState({
        description: "",
        precio_unitario: 0,
        amount: 0,
        value: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // If description is selected, automatically fill in the price
        if (name === 'description') {
            const selectedAdd = adds.find(add => add.id === value);
            setFormData(prevData => ({
                ...prevData,
                description: value,
                precio_unitario: selectedAdd ? selectedAdd.price : 0,
                value: selectedAdd && prevData.amount ? selectedAdd.price * prevData.amount : 0
            }));
        } 
        // If amount is changed, recalculate value based on price
        else if (name === 'cantidad') {
            const amount = Number(value);
            setFormData(prevData => ({
                ...prevData,
                amount,
                value: prevData.precio_unitario * amount
            }));
        }
        // For other fields, update normally
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSaveProductAditional(formData); 
        handleClose(); 
    };

    useEffect(() => {
        const fetchAdds = async () => {
            try {
                const AddsData = await getAllAdds();
                setAdds(AddsData)
            } catch (error) {
                console.error("Error al obtener los productos adicionales")
            }
        }
        fetchAdds()
    }, [])

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Formulario de producto adicional</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="select"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un producto adicional</option>
                            {adds.map((add) => (
                                <option key={add.id} value={add.id}>
                                    {add.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formPrecioUnitario">
                        <Form.Label>Precio unitario</Form.Label>
                        <Form.Control
                            type="number"
                            name="precio_unitario"
                            value={formData.precio_unitario}
                            onChange={handleChange}
                            placeholder="Precio unitario del producto adicional"
                            disabled
                        />
                    </Form.Group>
                    <Form.Group controlId="formCantidad">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            name="cantidad"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Ingrese la cantidad del producto adicional"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formValor">
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                            type="number"
                            name="valor"
                            value={formData.value}
                            onChange={handleChange}
                            placeholder="Valor total"
                            disabled
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" type="submit">
                            Añadir producto adicional
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FormProductoAdicionalModal;