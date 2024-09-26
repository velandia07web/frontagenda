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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
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
  const navigate = useNavigate(); // Hook para navegación

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
      title: `¿Estás seguro de que deseas eliminar la zona ${row.name}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteZone(row.id!); // Asegúrate de que id no sea undefined
        setZonas((prev) => prev.filter((zona) => zona.id !== row.id));
        Swal.fire("Eliminado", `Zona ${row.name} eliminada`, "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la zona", "error");
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
      name: "Editar",
      cell: (row: Zone) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: Zone) => (
        <button className="btn btn-link" onClick={() => handleDelete(row)}>
          <FontAwesomeIcon icon={faTrash} />
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
          className={`content-area-table ${
            isSlideMenuExpanded ? "expanded" : ""
          }`}
        >
          <div className="container mt-4">
            <div className="botones">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FontAwesomeIcon icon={faUsers} /> Regresar
              </button>
              <button onClick={handleCreate} className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} /> Crear Zona
              </button>
              <input
                type="text"
                className="form-control buscador"
                placeholder="Buscar en la tabla..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
