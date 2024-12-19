import React, { useState, useEffect } from "react";
import {
  getAllZones,
  createZone,
  updateZone,
  deleteZone,
  Zone,
} from "../../servicios/zone"; // Importa los servicios
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
//import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaZona.css"; // Importa el archivo CSS
import FormZona from "../formZonas/formZonas";
import Swal from "sweetalert2"; // Importa sweetalert2
import styled from "styled-components";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaZona: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedZona, setSelectedZona] = useState<Zone | null>(null); // Estado para la zona seleccionada
  const [isEditing, setIsEditing] = useState(false);
  const [showModalZona, setShowModalZona] = useState(false);
  const [zonas, setZonas] = useState<Zone[]>([]); // Estado para las zonas
  //const navigate = useNavigate(); // Hook para navegación

  const fetchZones = async () => {
    try {
      const fetchedZones = await getAllZones();
      console.log("zonas", fetchedZones);
      setZonas(fetchedZones);
    } catch (error) {
      console.error("Error al obtener zonas:", error);
    }
  };

  // Llama a fetchZones al montar el componente
  useEffect(() => {
    fetchZones();
  }, []);

  const handleEdit = (zone: Zone) => {
    setSelectedZona(zone);
    setIsEditing(true);
    setShowModalZona(true);
  };

  const handleCreate = () => {
    setSelectedZona(null);
    setIsEditing(false);
    setShowModalZona(true);
  };

  const handleDelete = async (row: Zone) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de cambiar el estado de ${row.name}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteZone(row.id!); // Asegúrate de que id no sea undefined
        setZonas((prev) => prev.filter((zona) => zona.id !== row.id));
        Swal.fire("Estado cambiado", `Zona ${row.name} cambiada`, "success");
        window.location.reload()
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar el estado de la zona", "error");
      }
    }
  };

  const handleCloseModalZona = () => {
    setShowModalZona(false);
    setSelectedZona(null);
  };

  const handleModalSubmit = async (zone: Zone) => {
    try {
      if (isEditing && selectedZona) {
        const updatedZone = await updateZone(selectedZona.id!, zone);
        setZonas((prev) =>
          prev.map((z) => (z.id === selectedZona.id ? updatedZone : z))
        );
        Swal.fire("Actualizado", `Zona ${zone.name} actualizada`, "success");
      } else {
        const newZone = await createZone(zone);
        setZonas((prev) => [...prev, newZone]);
        Swal.fire("Creado", `Zona ${zone.name} creada`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la zona", "error");
    } finally {
      handleCloseModalZona();
      fetchZones();
    }
  };

  const filteredZona = Array.isArray(zonas)
    ? zonas.filter((zona) =>
      Object.values(zona).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    : [];

  const columns = [
    { name: "Nombre", selector: (row: Zone) => row.name, sortable: true },
    {
      name: "Estado",
      cell: (row: Zone) => (
        <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.state}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Editar",
      cell: (row: Zone) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: Zone) => (
        <button className="btn btn-link" onClick={() => handleDelete(row)}>
          <FontAwesomeIcon icon={faPowerOff} />
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
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""
            }`}
        >
          <div className="containerZ">
            <h1 className="text-center titulo-tabla">Tabla de zonas</h1>{" "}
            {/* Título centrado */}
            <div className="botonesZ">
              {/* <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FontAwesomeIcon icon={faUsers} />
              </button> */}
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>crear Zona</h6>
              </button>
              <div className="BuscadorZ">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={filteredZona}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalZona && (
        <FormZona
          show={showModalZona}
          handleClose={handleCloseModalZona}
          selectedZone={selectedZona}
          isEditing={isEditing}
          onSubmit={handleModalSubmit} // Pasa la función de envío al formulario
        />
      )}
    </div>
  );
};

export default TablaZona;
