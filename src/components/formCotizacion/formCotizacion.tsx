import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { SocialMedia, getAllSocialMedias } from "../../servicios/socialMedia";
import { getAllClientsFiltred, clientFiltred, getCompanyByClientId } from "../../servicios/clients";
import { getAllTypePrices, TypePrices } from "../../servicios/TypePrices";
import { Company } from "../../servicios/Company";
import { Event, Quotations, createQuotation } from "../../servicios/quotations";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import FormEventsModal from "../formEvent/formEvent";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./formContizacion.css";
import ResumeQuotations from "../resumeCotizacion/resumeCotizacion";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
`;

const FormCotization: React.FC<Quotations> = () => {
    const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
    const [showFormModalEvent, setShowFormModalEvent] = useState(false);
    const [showModalQuotations, setShowModalQuotations] = useState(false);
    const [quotation, setQuotation] = useState<Quotations>();
    const [events, setEvents] = useState<any[]>([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    socialMedias,
                    clientsData,
                    typePricesData,
                ] = await Promise.all([
                    getAllSocialMedias(),
                    getAllClientsFiltred(),
                    getAllTypePrices(),
                ]);

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
                handleOpenModalQuotations()
            }

            alert("Cotización creada con éxito");

            setFormData({
                reference: "",
                clientId: "",
                discount: 0,
                typePricesId: "",
                telephone: "",
                SocialMediasId: "",
                email: "",
                events: [],
            });
            setEvents([]); // Limpiar los eventos

        } catch (error) {
            console.error("Error al crear la cotización:", error);
            alert("Hubo un error al crear la cotización");
        }
    };

    const columns = [
        {
            name: "Nombre del evento",
            selector: (row: Event) => row.name,
            sortable: true,
            center: true,
        },
        {
            name: "Ciudad",
            selector: (row: Event) => row.cityId,
            sortable: true,
            center: true,
        },
        {
            name: "Fecha de evento",
            selector: (row: Event) => row.dateEvent,
            sortable: true,
            center: true,
        },
        {
            name: "Cantidad de productos",
            selector: (row: Event) => row.products.length,
            sortable: true,
            center: true,
        },
        {
            name: "Cantidad de adicionales",
            selector: (row: Event) => row.adds.length,
            sortable: true,
            center: true,
        },
        {
            name: "Cantidad de paquetes",
            selector: (row: Event) => row.packs.length,
            sortable: true,
            center: true,
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
                                    <Form.Group controlId="formCotizacion">
                                        <Form.Label>Cotización</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el número de la cotización"
                                            name="reference"
                                            value={formData.reference}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
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
                                            {socialMedia.map((zona) => (
                                                <option key={zona.id} value={zona.id}>
                                                    {zona.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row mb-3">
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
                                            disabled
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
                            </div>

                            <div className="d-flex  gap-2 mb-4" >
                                <Button variant="primary" type="button" onClick={handleOpenModalEvent}>
                                    Añadir evento
                                </Button>
                            </div>

                            <div className="contenedorTabla">
                                <div className="table-responsive">
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
                    quotation={quotation!}
                    handleClose={handleCloseModalQuotations}
                />
            )}
        </div>
    );
};

export default FormCotization;