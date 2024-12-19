import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { SocialMedia, getAllSocialMedias } from "../../servicios/socialMedia";
import { getAllCities, City } from "../../servicios/city";
import { getAllClientsFiltred, clientFiltred, getCompanyByClientId } from "../../servicios/clients";
import { getAllTypePrices, TypePrices } from "../../servicios/TypePrices";
import { Company } from "../../servicios/Company";
import { Event, Quotations, createQuotation, response } from "../../servicios/quotations";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import FormEventsModal from "../formEvent/formEvent";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./formContizacion.css";
import ResumeQuotations from "../resumeCotizacion/resumeCotizacion";
import Swal from "sweetalert2";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
`;

const FormCotization: React.FC<Quotations> = () => {
    const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
    const [showFormModalEvent, setShowFormModalEvent] = useState(false);
    const [showModalQuotations, setShowModalQuotations] = useState(false);
    const [quotation, setQuotation] = useState<response>();
    const [events, setEvents] = useState<Event[]>([]);
    const [cities, setCities] = useState<City[]>([])
    const [clients, setClients] = useState<Array<clientFiltred>>([]);
    const [typePrices, setTypePrices] = useState<Array<TypePrices>>([]);
    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
    const [_selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [clientSelected, setClientSelected] = useState<clientFiltred | null>(null)
    const handleOpenModalEvent = () => setShowFormModalEvent(true);
    const handleOpenModalQuotations = () => setShowModalQuotations(true);
    const handleCloseModalQuotations = () => setShowModalQuotations(false);
    const handleCloseModalEvent = () => setShowFormModalEvent(false);

    const handleDeleteEvent = (index: number) => {
        setEvents(events.filter((_, i) => i !== index));
    };

    const handleToggleMenu = (isExpanded: boolean) => {
        setIsSlideMenuExpanded(isExpanded);
    };

    const getDate = (): string => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const resultEvents = () => {
        let result = 0;
        let subTotal = 0;
    
        events.forEach(event => {
            subTotal += event.total;
        });
    
        // Convertir el valor de (formData.IVA / 100) a decimal y asegurar que es un número
        const resultIVA = subTotal * parseFloat((formData.IVA / 100).toFixed(2));
        result = (subTotal - formData.discount) + resultIVA;
    
        return {
            result: result,
            resultIVA: resultIVA,
            subTotal: subTotal,
        };
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    citiesData,
                    socialMedias,
                    clientsData,
                    typePricesData,
                ] = await Promise.all([
                    getAllCities(),
                    getAllSocialMedias(),
                    getAllClientsFiltred(),
                    getAllTypePrices(),
                ]);
                setCities(citiesData)
                setSocialMedia(socialMedias);
                setClients(clientsData);
                setTypePrices(typePricesData);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        reference: "",
        clientId: "",
        discount: 0,
        IVA: 19,
        totalNeto: 0,
        subTotal: 0,
        typePricesId: "",
        telephone: "",
        SocialMediasId: "",
        email: "",
        events: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Si el campo es discount, asegura que el valor sea un número
        if (name === 'discount') {
            const numericValue = value === "" ? 0 : parseFloat(value);
            setFormData({
                ...formData,
                [name]: numericValue,
            });
        } else {
            // Para otros campos, simplemente actualiza el valor
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        // Si el campo de clientId cambia, actualizamos el cliente seleccionado
        if (name === 'clientId') {
            const client = clients.find(client => client.idCliente === value);
            if (client) {
                setClientSelected(client);
                getCompanyByClientId(value).then(company => setSelectedCompany(company));
            }
        }
    };

    const addEvent = (event: any) => {
        setEvents([...events, event]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cotizacion: Quotations = {
            reference: formData.reference,
            clientId: formData.clientId,
            discount: formData.discount,
            IVA: formData.IVA,
            totalNeto: resultEvents().result,
            subTotal: resultEvents().subTotal,
            typePricesId: formData.typePricesId,
            telephone: clientSelected?.telCliente || "No asociado",
            SocialMediasId: formData.SocialMediasId,
            email: clientSelected?.emailcliente || "",
            events: events,
        };
        try {
            const res = await createQuotation(cotizacion);

            if (res) {
                setQuotation(res)
                console.log(res)
                handleOpenModalQuotations()
            }

              Swal.fire(
                              "Cotización creada",
                              `Se ha creado la cotización ${res.id}`,
                              "success"
                            );

            setFormData({
                reference: "",
                clientId: "",
                discount: 0,
                IVA: 0,
                totalNeto: 0,
                subTotal:0,
                typePricesId: "",
                telephone: "",
                SocialMediasId: "",
                email: "",
                events: [],
            });
            setEvents([]); // Limpiar los eventos

        } catch (error) {
            console.error("Error al crear la cotización:", error);
            Swal.fire(
                "Error",
                `Ocurrió un error al momento de crear la cotización`,
                "error"
              );
        }
    };

    const columns = [
        {
            name: "Nombre del evento",
            selector: (row: Event) => row.name,
            sortable: true,
            center: true,
            width: '100px'
        },
        {
            name: "Ciudad",
            cell: (row: Event) => {
                const city = cities.find((city) => city.id === row.cityId); // Busca la ciudad por ID
                return city ? city.name : "Ciudad no encontrada"; // Devuelve el nombre de la ciudad o un mensaje de error
            },
            sortable: true,
            center: true,
        },
        {
            name: "Fecha de inicio",
            selector: (row: Event) => row.dateStart,
            sortable: true,
            center: true,
        },
        {
            name: "Fecha fin",
            selector: (row: Event) => row.dateEnd,
            sortable: true,
            center: true,
        },
        {
            name: "Productos",
            cell: (row: Event) => (
                <ul>
                    {row.products.map((product) => (
                        <li key={product.id}>
                            {product.nameProduct}, <br />
                            Cantidad: {product.quantity},  <br />
                            Horas: {product.hour}, <br />
                            Precio: ${product.price} <br /> 
                            Precio Hora Muerta: ${product.priceDeadHour}, <br /> 
                            Cantida de horas muertas: {product.quantityPriceDeadHour}
                        </li>
                    ))}
                </ul>
            ),
            width: "200px",
            sortable: true,
            center: true,
        },
        {
            name: "Adicionales",
            cell: (row: Event) => (
                <ul>
                    {row.adds.map((add) => (
                        <li key={add.id}>
                            {add.nameAdd}, <br />
                            Precio: ${add.price}, <br />
                            Cantidad: {add.quantity}
                        </li>
                    ))}
                </ul>
            ),
            width: "150px",
            sortable: true,
            center: true,
        },
        {
            name: "Paquetes",
            cell: (row: Event) => (
                <ul>
                    {row.packs.map((pack) => (
                        <li key={pack.id}>
                            {pack.namePack},<br /> 
                            Precio: ${pack.price},<br /> 
                            Cantidad: {pack.quantity}
                        </li>
                    ))}
                </ul>
            ),
            width: "150px",
            sortable: true,
            center: true,
        },
        {
            name: "Total del evento",
            selector: (row: Event) => `$ ${row.total}`,
            sortable: true,
            center: true
        },
        {
            name: "Eliminar",
            cell: (_row: Event, index: number) => (
                <button
                    onClick={() => handleDeleteEvent(index)} // Pasa el índice de la fila
                    className="btn btn-danger m-1"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            ),
            sortable: false, // El botón no se necesita para ordenar
            center: true,
        },
    ];

    return (
        <div className="homepage-container">
            <NavbarComponent />
            <div className="d-flex">
                <SlideMenu onToggleMenu={handleToggleMenu} />
                <main className={`content-area ${isSlideMenuExpanded ? "expanded" : ""}`}>
                    <div className="container mt-4">
                        <h1 className="text-center titulo-tabla">Cotización</h1>
                        <Form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                           
                                <div className="col-md-4">
                                    <Form.Group controlId="formFecha">
                                        <Form.Label>Fecha</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="fecha"
                                            value={getDate()}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formReferencia">
                                        <Form.Label>Referencia</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="SocialMediasId"
                                            value={formData.SocialMediasId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar Referencia</option>
                                            {socialMedia.map((media) => (
                                                <option key={media.id} value={media.id}>
                                                    {media.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">

                                    <Form.Group controlId="formNombre">
                                        <Form.Label>Cliente</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="clientId"
                                            value={formData.clientId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar cliente</option>
                                            {clients?.map((clie) => (
                                                <option key={clie.idCliente} value={clie.idCliente}>
                                                    {clie.nameCliente} - {clie.nameCompany}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formEmpresa">
                                        <Form.Label>Empresa</Form.Label>
                                        <Form.Control
                                            className="input"
                                            type="text"
                                            placeholder="Ingrese la empresa"
                                            value={clientSelected?.nameCompany}
                                            required
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formTelefono">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            className="input"
                                            type="tel"
                                            name="telephone"
                                            value={clientSelected?.telCliente}
                                            placeholder="Ingrese el teléfono"
                                            required
                                            disabled
                                        />
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Correo Electrónico</Form.Label>
                                        <Form.Control
                                            className="input"
                                            type="email"
                                            name="email"
                                            value={clientSelected?.emailcliente}
                                            onChange={handleChange}
                                            placeholder="Ingrese el correo electrónico"
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formTipoEvento">
                                        <Form.Label>Tipo de Evento</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="typePricesId"
                                            value={formData.typePricesId}
                                            onChange={handleChange}
                                            required

                                        >
                                            <option value="">Seleccionar tipo de evento</option>
                                            {typePrices?.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formDiscount">
                                        <Form.Label>Descuento</Form.Label>
                                        <Form.Control
                                            className="input"
                                            type="number"
                                            name="discount"
                                            value={formData.discount || 0}  // Asegúrate de que siempre tenga un valor
                                            placeholder="Ingrese el descuento"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="formIVA">
                                        <Form.Label>IVA sin el %</Form.Label>
                                        <Form.Control
                                            className="input"
                                            type="number"
                                            name="IVA"
                                            value={formData.IVA || 19}  // Asegúrate de que siempre tenga un valor
                                            placeholder="Ingrese el IVA sin %"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                </div>
                            </div>
                            <div className="d-flex  gap-2 mb-4" >
                                <Button variant="primary" type="button" onClick={handleOpenModalEvent}>
                                    Añadir evento
                                </Button>
                            </div>

                            <div className="contenedorTabla">
                                <div className="table-responsiveFormCotizacion">
                                    <StyledDataTable
                                        columns={columns}
                                        data={events}
                                        highlightOnHover
                                        pointerOnHover
                                        dense
                                        noDataComponent="No hay servicios registrados."
                                    />
                                </div>
                            </div>  
                            <div className="d-flex justify-content-center">
    <div>
        <div className="d-flex justify-content-between mb-2">
            <h5>Subtotal:</h5>
            <h5>$ {resultEvents().subTotal}</h5>
        </div>
        <div className="d-flex justify-content-between mb-2">
            <h5>IVA:</h5>
            <h5>{formData.IVA}%</h5>
        </div>
        <div className="d-flex justify-content-between mb-2">
            <h5>IVA total:</h5>
            <h5>$ {resultEvents().resultIVA}</h5>
        </div>
        <div className="d-flex justify-content-between mb-2">
            <h5>Descuento:</h5>
            <h5>$ {formData.discount}</h5>
        </div>
        <div className="d-flex justify-content-between gap-5">
            <h5>Total neto a pagar:</h5>
            <h5>$ {resultEvents().result}</h5>
        </div>
    </div>
</div>

                            <div className="text-center mt-4">
                                <Button variant="primary" type="submit">
                                    Crear cotización
                                </Button>
                            </div>
                        </Form>
                    </div>
                </main>
            </div>

            {showFormModalEvent && (
                <FormEventsModal
                    show={showFormModalEvent}
                    handleClose={handleCloseModalEvent}
                    idTypePrice={formData.typePricesId}
                    onSaveEvent={addEvent} // Pasamos la función para agregar eventos
                />
            )}

            {showModalQuotations && (
                <ResumeQuotations
                    show={showModalQuotations}
                    idQuotation={quotation?.id || ""}
                    handleClose={handleCloseModalQuotations}
                />
            )}
        </div>
    );
};

export default FormCotization;