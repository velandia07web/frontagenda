import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { getEventById, updateEvent, Event } from "../../servicios/Events"; // Asegúrate de tener los servicios correctos
import DataTable from "react-data-table-component";
import styled from "styled-components";
import FormODS from "../formODS/formODS";
const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

interface EventResumeAllProps {
    show: boolean;
    handleClose: () => void;
    idEvent: string;
}

const ResumeEventAll: React.FC<EventResumeAllProps> = ({
    show,
    handleClose,
    idEvent,
}) => {
    const [eventResume, setEventResume] = useState<Event | null>(null);
    const [eventProducts, setEventProducts] = useState<{ name: string, description: string, quantity: number }[]>([]); // Para productos asociados
    const [eventAdds, setEventAdds] = useState<{ name: string,description: string, quantity: number }[]>([]); // Para productos asociados
    const [eventPacks, setEventPacks] = useState<{ name: string,description: string, quantity: number }[]>([]); // Para productos asociados

    const [showForm, setShowForm] = useState(false); // Estado para controlar la apertura del formulario

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos del evento
                const eventData = await getEventById(idEvent);
                setEventResume(eventData);

                // Obtener los productos relacionados con el evento
                if (eventData?.eventProducts) {
                    setEventProducts(eventData.eventProducts);
                }

                if (eventData?.eventAdds) {
                    setEventAdds(eventData.eventAdds);
                }

                if (eventData?.eventPacks) {
                    setEventPacks(eventData.eventPacks);
                }

                // Imprimir datos para depuración
                console.log("Datos del evento:", eventData);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [idEvent]);

    const handleOpenFormEvent = () => {
        setShowForm(true); // Abre el formulario cuando se haga clic en Completar evento
    };

    const handleCloseFormEvent = () => {
        setShowForm(false); // Cierra el formulario
    };

    const handleUpdateEvent = async (updatedEvent: Event) => {
        try {
            // Aquí llamamos al servicio updateEvent
            await updateEvent(updatedEvent.id, updatedEvent);
            Swal.fire("Éxito", "Evento actualizado correctamente", "success");
            handleCloseFormEvent(); // Cierra el formulario después de la actualización
            // Actualiza el estado local si es necesario para reflejar los cambios
            setEventResume(updatedEvent);
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al actualizar el evento", "error");
            console.error(error);
        }
    };

    const workTeam = [
        { role: "Coordinador", ...eventResume?.coordinator },
        { role: "Diseñador", ...eventResume?.designer },
        { role: "Logistico", ...eventResume?.logistic },
    ]


    const columnsWorkTeam = [
        { name: "Rol", selector: (row:any) => row.role, sortable: true },
        { name: "Nombre", selector: (row:any) => row.name, sortable: true },
        { name: "Cedula", selector: (row:any) => row.cedula, sortable: true },
        { name: "Correo electronico", selector: (row:any) => row.email, sortable: true },
    ];

    const columnsProducts = [
        { name: "Cabina", selector: (row: any ) => row.name, sortable: true },
        { name: "Descripción", selector: (row: any) => row.description, sortable: true },
        { name: "Cantidad", selector: (row: any ) => row.quantity, sortable: true },
    ];
    const columnsAdicionales = [
        { name: "Adicionales", selector: (row: { name: string }) => row.name, sortable: true },
        { name: "Descripción", selector: (row: any) => row.description, sortable: true },
        { name: "Cantidad", selector: (row: any ) => row.quantity, sortable: true },
    ];
    const columnsPacks = [
        { name: "Paquetes", selector: (row: { name: string }) => row.name, sortable: true },
        { name: "Descripción", selector: (row: any) => row.description, sortable: true },
        { name: "Cantidad", selector: (row: any ) => row.quantity, sortable: true },
    ];

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Resumen del Evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Información del Evento */}
                    <h4 className="text-center">Detalles del Evento</h4>
                    <div className="d-flex justify-content-center m-4">
                        <div className="row w-100">
                            {/* Columna 1: Títulos */}
                            <div className="col-12 col-md-3">
                                <p><strong>Nombre:</strong></p>
                                <p><strong>Fecha inicio:</strong></p>
                                <p><strong>Fecha fin:</strong></p>
                                <p><strong>Total:</strong></p>
                                <p><strong>Precio de transporte:</strong></p>
                            </div>
                            {/* Columna 2: Valores */}
                            <div className="col-12 col-md-3">
                                <p>{eventResume?.name}</p>
                                <p>{eventResume?.dateStart}</p>
                                <p>{eventResume?.dateEnd}</p>
                                <p>${eventResume?.total}</p>
                                <p>${eventResume?.transportPrice}</p>
                            </div>

                            {/* Columna 3: Títulos */}
                            <div className="col-12 col-md-3">
                                <p><strong>Contacto para montaje:</strong></p>
                                <p><strong>Teléfono del contacto:</strong></p>
                                <p><strong>Dirección:</strong></p>
                                <p><strong>Descripción del evento:</strong></p>
                            </div>
                            {/* Columna 4: Valores */}
                            <div className="col-12 col-md-3">
                                <p>{eventResume?.personName || "No asignada"}</p>
                                <p>{eventResume?.personPhone || "No asignada"}</p>
                                <p>{eventResume?.location || "No asignada"}</p>
                                <p>{eventResume?.eventDescription || "No asignada"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={handleOpenFormEvent}>
                            Completar evento
                        </button>
                    </div>
                    <hr />
                    <h4 className="text-center">Equipo de trabajo</h4>
                    <div className="table-responsiveResume">
                        <StyledDataTable
                            columns={columnsWorkTeam}
                            data={workTeam}
                            highlightOnHover
                            pointerOnHover
                            dense
                        />
                    </div>
                    <hr />

                    {/* Información de los Productos */}
                    <h4 className="text-center">Cabinas</h4>
                    <div className="table-responsiveResume">
                        <StyledDataTable
                            columns={columnsProducts}
                            data={eventProducts}
                            highlightOnHover
                            pointerOnHover
                            dense
                        />
                    </div>


                    {/* Información Adicional */}
                    <h4 className="text-center">Adicionales</h4>
                    <div className="table-responsiveResume">
                        <StyledDataTable
                            columns={columnsAdicionales}
                            data={eventAdds}
                            highlightOnHover
                            pointerOnHover
                            dense
                        />
                    </div>

                    {/* Información de Paquetes */}
                    <h4 className="text-center">Paquetes</h4>
                    <div className="table-responsiveResume">
                        <StyledDataTable
                            columns={columnsPacks}
                            data={eventPacks}
                            highlightOnHover
                            pointerOnHover
                            dense
                        />
                    </div>

                    <hr />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <button className="btn btn-secondary" onClick={handleClose}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Aquí abrimos el formulario en un modal si showForm es true */}
            {showForm && (
                <FormODS
                    show={showForm}
                    handleClose={handleCloseFormEvent}
                    selectedEvent={eventResume}
                    isEditing={true}
                    onSubmit={handleUpdateEvent}
                />
            )}
        </>
    );
};

export default ResumeEventAll;
