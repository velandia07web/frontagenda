import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { getAllEvents, Event } from "../../servicios/Events";
import { getAllCities, City } from "../../servicios/city";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaEvents.css";
import styled from "styled-components";
import ResumeEventAll from "../resumeEvent/resumeEvent";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TableEvents: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null); // ID de la venta seleccionada

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getAllEvents();
        const citiesData = await getAllCities();
        setCities(citiesData);
        setEvents(eventsData);
      } catch (error) {
        console.error("No se han podido traer los eventos: ", error);
      }
    };

    fetchData();
  }, []);

  const getEventById = (id: string) => {
    setSelectedEventId(id);
    setShowModal(true); 
  }
  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    setSelectedEventId(null); // Resetea el ID de la venta seleccionada
  };
  const columns = [
    {
      name: "Nombre del Evento",
      selector: (row: Event) => row.name,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: Event) => (
        <div className={`state ${row.status === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.status}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Descripción del Evento",
      selector: (row: Event) => row.eventDescription || "No asignada",
      sortable: true,
    },{
      name: "Imagen del evento",
      selector: (row: Event) => row.eventImage || "No asignada",
      sortable: true,
    },{
      name: "Dirección",
      selector: (row: Event) => row.location || "No asignada",
      sortable: true,
    },
    {
      name: "Ciudad",
      selector: (row: Event) => {
        const city = cities.find((c) => c.id === row.cityId);
        return city ? city.name : "Ciudad no encontrada";
      },
      sortable: true,
    },
    {
      name: "Fecha de Inicio",
      selector: (row: Event) => row.dateStart,
      sortable: true,
    },
    {
      name: "Fecha de Fin",
      selector: (row: Event) => row.dateEnd,
      sortable: true,
    },
    {
      name: "Días",
      selector: (row: Event) => row.days,
      sortable: true,
    },
    {
      name: "Precio de transporte",
      selector: (row: Event) => row.transportPrice,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row: Event) => row.total,
      sortable: true,
    },
   
    {
      name: "Ver más",
      cell: (row: Event) => (
        <button className="btn btn-link" onClick={() => getEventById(row.id || "")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaClien">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="container mt-4">
            <h1 className="text-center titulo-tabla">Tabla de Eventos</h1>
            <div className="botonesC">
              <div className="BuscadorC">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={events.filter((event) =>
                  event.name.toLowerCase().includes(search.toLowerCase())
                )}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      <ResumeEventAll
        handleClose={handleCloseModal}
        idEvent={selectedEventId || ""}
        show={showModal}
      />
    </div>
  );
};

export default TableEvents;
