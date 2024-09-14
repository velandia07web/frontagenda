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
import "./tablaRedSocial.css"; // Importa el archivo CSS
import FormRoll from "../formRedSocial/formRedSocial";
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult

interface red {
  nombreRed: string;
}

const redes: red[] = [
  {
    nombreRed: "Facebook",
  },
  {
    nombreRed: "Instagram",
  },
  {
    nombreRed: "P.W kuva",
  },
  {
    nombreRed: "Watsapp",
  },
  {
    nombreRed: "Recomendado",
  },
  // Agrega más datos según sea necesario
];

const TablaRed: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRed, setSelectedRed] = useState<red | null>(null); // Estado para el roll seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const navigate = useNavigate(); // Hook para navegación
  const [showModalred, setShowModalred] = useState(false);

  // Maneja la edición
  const handleEdit = (row: red) => {
    setSelectedRed(row); // Guarda el rol seleccionado para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalred(true); // Abre el modal
  };

  // Maneja la creación de un nuevo rol
  const handleCreate = () => {
    setSelectedRed(null); // Resetea el rol seleccionado
    setIsEditing(false); // Activa el modo creación
    setShowModalred(true); // Abre el modal
  };

  const handleDelete = (row: red) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar La Red ${row.nombreRed}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: `Rol ${row.nombreRed} eliminado`,
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

  const handleCloseModalred = () => {
    setShowModalred(false);
  };

  // Filtra los datos basado en la búsqueda
  const filteredroll = redes.filter((red) =>
    Object.values(red).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: red) => row.nombreRed, sortable: true },
    {
      name: "Editar",
      cell: (row: red) => (
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
      cell: (row: red) => (
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
      {showModalred && (
        <FormRoll
          show={showModalred}
          handleClose={handleCloseModalred}
          roll={selectedRed}
          isEditing={isEditing} // Pasa si está en modo edición o no
        />
      )}
    </div>
  );
};

export default TablaRed;
