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
import "./tablaEquipo.css"; // Importa el archivo CSS
import FormEquipo from "../formEquipoTrabajo/equipoTrabajo";
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult

interface equipo {
  nombre: string;
  apellido: string;
  cedula: number;
  roll: string;
  telefono: number;
  correo: string;
}

const equipoT: equipo[] = [
  {
    nombre: "Jhonatan smith ",
    apellido: "Velandia gallo",
    cedula: 1053839567,
    roll: "Super administrador",
    telefono: 30083522345,
    correo: "velandiajhonat@gmail.com",
  },
  {
    nombre: "Jhonatan smith ",
    apellido: "Velandia gallo",
    cedula: 1053839567,
    roll: "Super administrador",
    telefono: 30083522345,
    correo: "velandiajhonat@gmail.com",
  },
  {
    nombre: "Jhonatan smith ",
    apellido: "Velandia gallo",
    cedula: 1053839567,
    roll: "Super administrador",
    telefono: 30083522345,
    correo: "velandiajhonat@gmail.com",
  },
  {
    nombre: "Jhonatan smith ",
    apellido: "Velandia gallo",
    cedula: 1053839567,
    roll: "Super administrador",
    telefono: 30083522345,
    correo: "velandiajhonat@gmail.com",
  },
  {
    nombre: "Jhonatan smith ",
    apellido: "Velandia gallo",
    cedula: 1053839567,
    roll: "Super administrador",
    telefono: 30083522345,
    correo: "velandiajhonat@gmail.com",
  },
  // Agrega más datos según sea necesario
];

const TablaEquipo: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedequipo, setSelectedequipo] = useState<equipo | null>(null); // Estado para el roll seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const navigate = useNavigate(); // Hook para navegación
  const [showModalequipo, setShowModalequipo] = useState(false);

  // Maneja la edición
  const handleEdit = (row: equipo) => {
    setSelectedequipo(row); // Guarda el rol seleccionado para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalequipo(true); // Abre el modal
  };

  // Maneja la creación de un nuevo rol
  const handleCreate = () => {
    setSelectedequipo(null); // Resetea el rol seleccionado
    setIsEditing(false); // Activa el modo creación
    setShowModalequipo(true); // Abre el modal
  };

  const handleDelete = (row: equipo) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar el Usuario ${row.nombre}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: `Usuario ${row.nombre} eliminado`,
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

  const handleCloseModalEquipo = () => {
    setShowModalequipo(false);
  };

  // Filtra los datos basado en la búsqueda
  const filteredEquipo = equipoT.filter((equipo) =>
    Object.values(equipo).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: equipo) => row.nombre, sortable: true },
    {
      name: "Editar",
      cell: (row: equipo) => (
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
      cell: (row: equipo) => (
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
                data={filteredEquipo}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalequipo && (
        <FormEquipo
          show={showModalequipo}
          handleClose={handleCloseModalEquipo}
          roll={selectedequipo}
          isEditing={isEditing} // Pasa si está en modo edición o no
        />
      )}
    </div>
  );
};

export default TablaEquipo;
