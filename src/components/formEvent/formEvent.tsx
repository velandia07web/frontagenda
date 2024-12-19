import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllCities, City } from "../../servicios/city";
import { getAllZones, Zone } from "../../servicios/zone";
import { getAllProductsByTypePrice, ProductPriceElement, AddPriceElement, PackPriceElement } from "../../servicios/products";
import { EventAdd, EventPack, EventProduct, Event } from "../../servicios/quotations";
import Swal from "sweetalert2";

interface FormEvents {
    show: boolean;
    handleClose: () => void;
    idTypePrice: string;
    onSaveEvent: (event: Event) => void;
}

const FormEventsModal: React.FC<FormEvents> = ({ show, handleClose, idTypePrice, onSaveEvent }) => {
    // Estados
    const [productPriceElement, setProductPriceElement] = useState<ProductPriceElement[]>([]);
    const [addPriceElements, setAddPriceElements] = useState<AddPriceElement[]>([]);
    const [packPriceElement, setPackPriceElement] = useState<PackPriceElement[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [zones, setZones] = useState<Zone[]>([])
    const [transportPrice, setTransportPrice] = useState(Number);
    const [selectedZone, setSelectedZone] = useState(String);
    const [selectedCity, setSelectedCity] = useState(String);

    const [eventProduct, setSelectedeventProduct] = useState<EventProduct[]>([]);
    const [eventAdd, setEventAdd] = useState<EventAdd[]>([]);
    const [eventPack, setEventPack] = useState<EventPack[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        cityId: "",
        idZone: "",
        dateStart: "",
        dateEnd: "",
        days: 1,
    });
    const resultSum = () => {
        let result = 0;
        eventProduct.forEach(product => {
            console.log(product)
            console.log(product.quantityPriceDeadHour)
            if(product.quantityPriceDeadHour > 0){
                result += (product.priceDeadHour * product.quantityPriceDeadHour ) * formData.days + (product.price * product.numberHour * product.quantity) * formData.days

            }else{
                result += (product.price * product.numberHour * product.quantity) * formData.days

            }
        }) 
        eventAdd.forEach(add => {
            result += (add.price * add.quantity) * formData.days
        }) 
        eventPack.forEach(pack => {
            result += (pack.price * pack.quantity) * formData.days
        })
        return result + transportPrice
    }
    // Estado de validación
    const [isProductSelected, setIsProductSelected] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const citiesData = await getAllCities();
                const dataZones = await getAllZones()
                setZones(dataZones)
                setCities(citiesData);

            } catch (error) {
                console.error("Error al obtener los datos: ", error);
            }
        };

        fetchData();
    }, [idTypePrice]);

    const calcDays = (dateStart: string, dateEnd: string): number => {
        if (dateStart && dateEnd) {
          const start = new Date(dateStart);
          const end = new Date(dateEnd);
      
          const diffInMs = end.getTime() - start.getTime();
      
          if (diffInMs < 0) {
            console.error("La fecha de inicio es posterior a la fecha de finalización");
            return 0;
          }
      
          return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        }
      
        console.error("Faltan las fechas");
        return 0;
      };
      

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name == "idZone") {
            setSelectedZone(value);
            console.log(value + " Soy una zona"); // Usa `value` en lugar de `selectedZone`
            getProducts(value, selectedCity); // Pasa `value` como parámetro
        }
        if ( name == "cityId") {
            setSelectedCity(value)
            console.log(value + " Soy una ciudad"); // Usa `value` en lugar de `selectedCity`
            getProducts(selectedZone, value); // Pasa `value` como parámetro
        }
       
        setFormData({
            ...formData,
            [name]: name === 'days' ? parseInt(value) : value,
        });
    };

    const getProducts = async (zone: string, city: string) => {
        try {
            if (zone && city) {
                const dataProducts = await getAllProductsByTypePrice(idTypePrice, zone, city);
                setTransportPrice(dataProducts.transportPrice);
                setProductPriceElement(dataProducts.products);
                setAddPriceElements(dataProducts.adds);
                setPackPriceElement(dataProducts.packs);
            } else {
                return;
            }
        } catch (error) {
            console.error("Error al obtener los datos: ", error);
        }
    };

    // Manejo de selección de productos
    const handleProductChange = (
        nameProduct: string,
        productId: string,
        hour: string | null,
        numberHour: number | null,
        price: number | null,
        priceDeadHour: number | null,
        quantityPriceDeadHour: number | null,
        quantity: number | null
    ) => {
        setSelectedeventProduct((prev) => {
            const exists = prev.find((item) => item.id === productId);
            if (exists) {
                return prev.map((item) =>
                    item.id === productId
                        ? {
                            ...item,
                            nameProduct,
                            hour: hour ?? item.hour, // Usa el valor existente si no se proporciona uno nuevo
                            price: price ?? item.price,
                            priceDeadHour: priceDeadHour ?? item.priceDeadHour,
                            numberHour: numberHour ?? 1,
                            quantityPriceDeadHour:
                                quantityPriceDeadHour ?? item.quantityPriceDeadHour,
                            quantity: quantity ?? item.quantity,
                        }
                        : item
                );
            } else {
                return [
                    ...prev,
                    {
                        id: productId,
                        nameProduct,
                        hour: hour ?? "",
                        price: price ?? 0,
                        numberHour: numberHour ?? 1,
                        days: formData.days,
                        priceDeadHour: priceDeadHour ?? 0,
                        quantityPriceDeadHour: quantityPriceDeadHour ?? 0,
                        quantity: quantity ?? 1,
                    },
                ];
            }
        });

        setIsProductSelected((prev) => prev || productId !== "");
    };


    // Manejo de selección de adicionales
    const handleAddChange = (addId: string, isChecked: boolean, price: number, nameAdd: string, quantity: number = 1) => {
        if (isChecked) {
            setEventAdd((prev) => {
                const exists = prev.find((item) => item.id === addId);
                if (!exists) {
                    return [...prev, { id: addId, price, quantity, nameAdd }];
                }
                return prev.map(item =>
                    item.id === addId ? { ...item, quantity, nameAdd } : item
                );
            });
        } else {
            setEventAdd((prev) => prev.filter((item) => item.id !== addId));
        }
    };

    // Manejo de selección de packs
    const handlePackSelect = (packId: string, selected: boolean, namePack: string, price: number, quantity: number = 1) => {
        if (selected) {
            setEventPack((prev) => {
                const exists = prev.find((item) => item.id === packId);
                if (!exists) {
                    return [...prev, { id: packId, quantity, namePack, price }];
                }
                return prev.map(item =>
                    item.id === packId ? { ...item, quantity, namePack, price } : item
                );
            });
        } else {
            setEventPack((prev) => prev.filter((item) => item.id !== packId));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const event: Event = {
            name: formData.name,
            cityId: formData.cityId,
            dateStart: formData.dateStart, 
            dateEnd: formData.dateEnd,
            days: calcDays(formData.dateStart, formData.dateEnd),
            total: resultSum(),
            transportPrice: transportPrice ,
            packs: eventPack,
            products: eventProduct,
            adds: eventAdd,
        };

        Swal.fire(
                  "Evento creado",
                  `Se ha creado el evento ${event.name}`,
                  "success"
                );

        onSaveEvent(event);
        handleClose();
    };

   

    return (
        <Modal show={show} onHide={handleClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Crear evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Formulario General */}
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="formName" className="mb-3">
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
                        </Col>

                        <Col md={4}>
                            <Form.Group controlId="formCity" className="mb-3">
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
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formZone" className="mb-3">
                                <Form.Label>Zona</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="idZone"
                                    value={formData.idZone}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Ciudad</option>
                                    {zones.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formDateStart" className="mb-3">
                                <Form.Label>Fecha Inicio del Evento</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateStart"
                                    value={formData.dateStart}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formDateEnd" className="mb-3">
                                <Form.Label>Fecha final del Evento</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateEnd"
                                    value={formData.dateEnd}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col> 
                        <Col md={4}>
                            <Form.Group controlId="formDays" className="mb-3">
                                <Form.Label>Días</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="days"
                                    value={calcDays(formData.dateStart, formData.dateEnd)}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="container">
                        <div className="row gap-2">
                            {/* Productos */}
                            <div className="border border-gray rounded p-3">
                                <Form.Group controlId="formProducts" className="mb-3">
                                    <Form.Label>Productos</Form.Label>
                                    {productPriceElement.map((product) => (
                                        <div
                                            key={product.id}
                                            className="d-flex align-items-center mb-2"
                                            style={{ gap: "10px" }}
                                        >
                                            <Col md={3}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={product.name}
                                                    onChange={(e) => {
                                                        const selected = e.target.checked;
                                                        if (selected) {
                                                            const defaultPrice = product.prices[0];
                                                            if (defaultPrice) {
                                                                handleProductChange(
                                                                    product.name,
                                                                    product.id,
                                                                    defaultPrice.hour,
                                                                    null,
                                                                    defaultPrice.price,
                                                                    defaultPrice.priceDeadHour,
                                                                    0, // Inicializa quantityPriceDeadHour
                                                                    1 // Inicializa quantity
                                                                );
                                                            }
                                                        } else {
                                                            setSelectedeventProduct((prev) =>
                                                                prev.filter((item) => item.id !== product.id)
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control
                                                    as="select"
                                                    onChange={(e) => {
                                                        const [hour, price] = e.target.value.split("-");
                                                        const selectedPrice = product.prices.find(
                                                            (p) => p.hour === hour && p.price === parseFloat(price)
                                                          );
                                                          const priceDeadHour = selectedPrice ? selectedPrice.priceDeadHour : 0;
                                                          const numberHour = selectedPrice ? selectedPrice.numberHour : null; // Asigna el priceDeadHour correspondiente
                                                          console.log(numberHour)
                                                        handleProductChange(
                                                            product.name,
                                                            product.id,
                                                            hour,
                                                            numberHour,
                                                            parseFloat(price),
                                                            priceDeadHour, // Asigna el priceDeadHour
                                                            null, // No modificar quantityPriceDeadHour
                                                            null // No modificar quantity
                                                        );
                                                    }}
                                                >
                                                    <option value="">Seleccionar Precio</option>
                                                    {product.prices.map((price, index) => (
                                                        <option
                                                            key={index}
                                                            value={`${price.hour}-${price.price}`}
                                                        >
                                                            {`${price.hour} - Precio: $${price.price.toFixed(2)} - Precio hora muerta: $${price.priceDeadHour}`}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>

                                            <Col md={2}>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="# de Cabinas"
                                                    min="1"
                                                    onChange={(e) => {
                                                        const quantity = parseInt(e.target.value);
                                                        handleProductChange(
                                                            product.name,
                                                            product.id,
                                                            null, // No modificar hour
                                                            null,
                                                            null, // No modificar price
                                                            null, // No modificar priceDeadHour
                                                            null, // No modificar quantityPriceDeadHour
                                                            quantity
                                                        );
                                                    }}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="# Horas muertas"
                                                    min="0"
                                                    onChange={(e) => {
                                                        const quantityPriceDeadHour = parseInt(e.target.value);
                                                        handleProductChange(
                                                            product.name,
                                                            product.id,
                                                            null, // No modificar hour
                                                            null,
                                                            null, // No modificar price
                                                            null, // No modificar priceDeadHour
                                                            quantityPriceDeadHour, // Actualizar horas muertas
                                                            null // No modificar quantity
                                                        );
                                                    }}
                                                />
                                            </Col>
                                        </div>
                                    ))}
                                </Form.Group>
                            </div>

                        </div>
                        <div className="row gap-5 d-flex justify-content-center">

                            {/* Adicionales */}
                            <div className=" border border-gray rounded p-3">
                                <Form.Group controlId="formAdds" className="mb-3">
                                    <Form.Label>Adicionales</Form.Label>
                                    {addPriceElements.map((add) => (
                                        <div key={add.id} className="d-flex align-items-center mb-2">
                                            <Col md={6}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={
                                                        <>
                                                            Nombre: {add.name} <br />
                                                        </>
                                                    }
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        handleAddChange(add.id, isChecked, add.price, add.name);
                                                    }}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <p>
                                                    Precio: $ {add.price}
                                                </p>
                                            </Col>
                                            <Col md={2}>

                                                {eventAdd.some(item => item.id === add.id) && (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Cantidad"
                                                        min="1"
                                                        onChange={(e) => {
                                                            const quantity = parseInt(e.target.value);
                                                            handleAddChange(
                                                                add.id,
                                                                true,
                                                                add.price,
                                                                add.name,
                                                                quantity

                                                            );
                                                        }}
                                                        style={{ marginLeft: '10px' }}
                                                    />
                                                )}
                                            </Col>

                                        </div>
                                    ))}
                                </Form.Group>
                            </div>


                        </div>
                        <div className="row gap-5 d-flex justify-content-center">

                            {/* Packs */}
                            <div className="border border-gray rounded p-3">
                                <Form.Group controlId="formPacks" className="mb-3">
                                    <Form.Label>Packs</Form.Label>
                                    {packPriceElement.map((pack) => (
                                        <div key={pack.id} className="d-flex align-items-center mb-2 gap-2">
                                            <Col md={5}>

                                                <Form.Check
                                                    type="checkbox"
                                                    label={
                                                        <>
                                                            Nombre: {pack.name} <br />
                                                            Descripción: {pack.description} <br />
                                                            Cabina: {pack.productName} <br />
                                                        </>
                                                    }
                                                    onChange={(e) => {
                                                        const selected = e.target.checked;
                                                        handlePackSelect(pack.id, selected, pack.name, pack.price);
                                                    }}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <p>
                                                    Precio de la hora muerta: $ {pack.priceDeadHour || 0}
                                                </p>
                                            </Col>
                                            <Col md={2}>
                                                <p>
                                                    Precio: $ {pack.price || 0}
                                                </p>
                                            </Col>

                                            <Col md={2}>

                                                {eventPack.some(item => item.id === pack.id) && (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Cantidad"
                                                        min="1"
                                                        onChange={(e) => {
                                                            const quantity = parseInt(e.target.value);
                                                            handlePackSelect(
                                                                pack.id,
                                                                true,
                                                                pack.name,
                                                                pack.price,
                                                                quantity,

                                                            );
                                                        }}
                                                        style={{ marginLeft: '10px' }}
                                                    />

                                                )}
                                            </Col>

                                        </div>
                                    ))}
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray rounded p-3 d-flex align-items-center justify-content-center text-center">
                        <h4>Total neto: $ {resultSum() || 0}</h4>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" type="submit">
                            Guardar evento
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FormEventsModal;