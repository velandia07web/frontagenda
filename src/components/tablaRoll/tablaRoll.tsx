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
import "./tablaRoll.css"; // Importa el archivo CSS
import FormRoll from "../formRoll/formRoll";
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult

interface roll {
  nombreRoll: string;
}

const rolles: roll[] = [
  {
    nombreRoll: "Super administrador",
  },
  {
    nombreRoll: "Administrador",
  },
  {
    nombreRoll: "Comercial",
  },
  {
    nombreRoll: "Coordinador",
  },
  {
    nombreRoll: "Diseño Grafico",
  },
  // Agrega más datos según sea necesario
];

const TablaRoll: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRoll, setSelectedRoll] = useState<roll | null>(null); // Estado para el roll seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const navigate = useNavigate(); // Hook para navegación
  const [showModalroll, setShowModalroll] = useState(false);

  // Maneja la edición
  const handleEdit = (row: roll) => {
    setSelectedRoll(row); // Guarda el rol seleccionado para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalroll(true); // Abre el modal
  };

  // Maneja la creación de un nuevo rol
  const handleCreate = () => {
    setSelectedRoll(null); // Resetea el rol seleccionado
    setIsEditing(false); // Activa el modo creación
    setShowModalroll(true); // Abre el modal
  };

  const handleDelete = (row: roll) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar el rol ${row.nombreRoll}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: `Rol ${row.nombreRoll} eliminado`,
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

  const handleCloseModalroll = () => {
    setShowModalroll(false);
  };

  // Filtra los datos basado en la búsqueda
  const filteredroll = rolles.filter((roll) =>
    Object.values(roll).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: roll) => row.nombreRoll, sortable: true },
    {
      name: "Editar",
      cell: (row: roll) => (
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
      cell: (row: roll) => (
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
                  <FontAwesomeIcon icon={faPlus} /> Crear Rol
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
                data={filteredroll}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalroll && (
        <FormRoll
          show={showModalroll}
          handleClose={handleCloseModalroll}
          roll={selectedRoll}
          isEditing={isEditing} // Pasa si está en modo edición o no
        />
      )}
    </div>
  );
};

export default TablaRoll;
