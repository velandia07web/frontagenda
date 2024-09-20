import React, { useState } from "react";
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
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult

interface zona {
  nombreZona: string;
}

const zonas: zona[] = [
  {
    nombreZona: "Bogota",
  },
  {
    nombreZona: "Medellin",
  },
  {
    nombreZona: "Cali",
  },
  {
    nombreZona: "Barranquilla",
  },
  {
    nombreZona: "Cartago",
  },
  {
    nombreZona: "Eje Cafetero",
  },
  // Agrega más datos según sea necesario
];

const tablaZona: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedzona, setSelectedzona] = useState<zona | null>(null); // Estado para el roll seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const navigate = useNavigate(); // Hook para navegación
  const [showModalzona, setShowModalzona] = useState(false);

  // Maneja la edición
  const handleEdit = (row: zona) => {
    setSelectedzona(row); // Guarda el rol seleccionado para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalzona(true); // Abre el modal
  };

  // Maneja la creación de un nuevo rol
  const handleCreate = () => {
    setSelectedzona(null); // Resetea el rol seleccionado
    setIsEditing(false); // Activa el modo creación
    setShowModalzona(true); // Abre el modal
  };

  const handleDelete = (row: zona) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar la zona ${row.nombreZona}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: `Zona ${row.nombreZona} eliminado`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // Implementa la lógica para eliminar el rol del servidor aquí
      }
    });
  };

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const handleGoToHome = () => {
    navigate("/home"); // Navega a la ruta de inicio
  };

  const handleCloseModalzona = () => {
    setShowModalzona(false);
  };

  // Filtra los datos basado en la búsqueda
  const filteredZona = zonas.filter((zona) =>
    Object.values(zona).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: zona) => row.nombreZona, sortable: true },
    {
      name: "Editar",
      cell: (row: zona) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Eliminar",
      cell: (row: zona) => (
        <button className="btn btn-link" onClick={() => handleDelete(row)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaClien">
        <SlideMenu onToggleMenu={handleToggleMenu} />
        <main
          className={`content-area-table ${
            isSlideMenuExpanded ? "expanded" : ""
          }`}
        >
          <div className="container mt-4">
            <div className="botones">
              <div className="botonR">
                <button className="btn btn-primary" onClick={handleGoToHome}>
                  <FontAwesomeIcon icon={faUsers} /> Regresar
                </button>
              </div>

              <div className="botonA">
                <button onClick={handleCreate} className="btn btn-primary">
                  <FontAwesomeIcon icon={faPlus} /> Crear Zona
                </button>
              </div>

              <div className="Buscador">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar en la tabla..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <DataTable
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
      {showModalzona && (
        <FormZona
          show={showModalzona}
          handleClose={handleCloseModalzona}
          roll={selectedzona}
          isEditing={isEditing} // Pasa si está en modo edición o no
        />
      )}
    </div>
  );
};

export default tablaZona;
