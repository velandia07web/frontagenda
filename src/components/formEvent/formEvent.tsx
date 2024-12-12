import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar el CSS de Bootstrap
import { getAllCities, City } from "../../servicios/city";
import { getAllProductsByTypePrice, ProductPriceElement, AddPriceElement, PackPriceElement } from "../../servicios/products";
import { EventAdd, EventPack, EventProduct, Event } from "../../servicios/quotations";

interface FormEvents {
    show: boolean;
    handleClose: () => void;
    idTypePrice: string;
    onSaveEvent: (event: Event) => void; // Recibe la función de agregar evento
}

const FormEventsModal: React.FC<FormEvents> = ({ show, handleClose, idTypePrice, onSaveEvent }) => {
    // Estados
    const [productPriceElement, setProductPriceElement] = useState<ProductPriceElement[]>([]);
    const [addPriceElements, setAddPriceElements] = useState<AddPriceElement[]>([]); 
    const [packPriceElement, setPackPriceElement] = useState<PackPriceElement[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [eventProduct, setSelectedeventProduct] = useState<EventProduct[]>([]); 
    const [eventAdd, setEventAdd] = useState<EventAdd[]>([]); 
    const [eventPack, setEventPack] = useState<EventPack[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        cityId: "",
        dateEvent: "",
    });

    // Estado de validación
    const [isProductSelected, setIsProductSelected] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const citiesData = await getAllCities();
                const dataProducts = await getAllProductsByTypePrice(idTypePrice);
                setCities(citiesData);
                setProductPriceElement(dataProducts.products);
                setAddPriceElements(dataProducts.adds);
                setPackPriceElement(dataProducts.packs);
            } catch (error) {
                console.error("Error al obtener los datos: ", error);
            }
        };

        fetchData();
    }, [idTypePrice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Manejo de selección de productos
    const handleProductChange = (productId: string, hour: string, price: number) => {
        setSelectedeventProduct((prev) => {
            const exists = prev.find((item) => item.id === productId);
            if (exists) {
                return prev.map((item) =>
                    item.id === productId ? { ...item, hour, price } : item
                );
            } else {
                return [
                    ...prev,
                    {
                        id: productId,
                        hour,
                        price,
                        hours: parseFloat(hour),
                        days: 1,
                        quantity: 1,
                    },
                ];
            }
        });

        // Activar validación si hay productos seleccionados
        if (eventProduct.length > 0 || !productId) {
            setIsProductSelected(true);
        } else {
            setIsProductSelected(false);
        }
    };

    // Manejo de selección de adicionales
    const handleAddChange = (addId: string, isChecked: boolean, price: number) => {
        if (isChecked) {
            setEventAdd((prev) => {
                const exists = prev.find((item) => item.id === addId);
                if (!exists) {
                    return [...prev, { id: addId, price, quantity: 1 }];
                }
                return prev;
            });
        } else {
            setEventAdd((prev) => prev.filter((item) => item.id !== addId));
        }
    };

    // Manejo de selección de packs
    const handlePackSelect = (packId: string, selected: boolean) => {
        if (selected) {
            setEventPack((prev) => [...prev, { id: packId }]);
        } else {
            setEventPack((prev) => prev.filter((item) => item.id !== packId));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validación: Solo permitir guardar si se selecciona al menos un producto
        if (!isProductSelected) {
            alert("Debe seleccionar al menos un producto para guardar.");
            return;
        }

        const event: Event = {
            name: formData.name,
            cityId: formData.cityId,
            dateEvent: formData.dateEvent,
            packs: eventPack,
            products: eventProduct,
            adds: eventAdd,
        };

        onSaveEvent(event);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Formulario General */}
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre del Evento</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del evento"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCity">
                        <Form.Label>Ciudad del evento</Form.Label>
                        <Form.Control
                            as="select"
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar Ciudad</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Fecha del Evento</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateEvent"
                            value={formData.dateEvent}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Productos */}
                    <Form.Group controlId="formProducts">
                        <Form.Label>Productos</Form.Label>
                        {productPriceElement.map((product) => (
                            <div key={product.id} className="d-flex align-items-center mb-2" style={{ gap: "10px" }}>
                                <Form.Check
                                    type="checkbox"
                                    label={product.name}
                                    onChange={(e) => {
                                        const selected = e.target.checked;
                                        if (selected) {
                                            const defaultPrice = product.prices[0];
                                            if (defaultPrice) {
                                                handleProductChange(product.id, defaultPrice.hour, defaultPrice.price);
                                            }
                                        } else {
                                            setSelectedeventProduct((prev) =>
                                                prev.filter((item) => item.id !== product.id)
                                            );
                                        }
                                    }}
                                />
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        const [hour, price] = e.target.value.split("-");
                                        handleProductChange(product.id, hour, parseFloat(price));
                                    }}
                                >
                                    <option value="">Seleccionar Precio</option>
                                    {product.prices.map((price, index) => (
                                        <option key={index} value={`${price.hour}-${price.price}`}>
                                            {`${price.hour} - $${price.price.toFixed(2)}`}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                        ))}
                    </Form.Group>

                    {/* Adicionales */}
                    <Form.Group controlId="formAdds">
                        <Form.Label>Adicionales</Form.Label>
                        {addPriceElements.map((add) => (
                            <div key={add.id} className="d-flex align-items-center mb-2">
                                <Form.Check
                                    type="checkbox"
                                    label={`${add.name} - $${add.price}`}
                                    onChange={(e) =>
                                        handleAddChange(add.id, e.target.checked, add.price)
                                    }
                                />
                            </div>
                        ))}
                    </Form.Group>

                    {/* Packs */}
                    <Form.Group controlId="formPacks">
                        <Form.Label>Packs</Form.Label>
                        {packPriceElement.map((pack) => (
                            <div key={pack.id} className="d-flex align-items-center mb-2">
                                <Form.Check
                                    type="checkbox"
                                    label={pack.name}
                                    onChange={(e) =>
                                        handlePackSelect(pack.id, e.target.checked)
                                    }
                                />
                            </div>
                        ))}
                    </Form.Group>

                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" type="submit">
                            Guardar Cotización
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FormEventsModal;
