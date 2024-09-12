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
import "./tablaClientes.css"; // Importa el archivo CSS
import FormClientes from "../formClientes/formClientes";
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult

interface Cliente {
  nombre: string;
  cedula: string;
  correo: string;
  telefono: string;
  ciudad: string;
}

const clientes: Cliente[] = [
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  {
    nombre: "Juan Pérez",
    cedula: "12345678",
    correo: "juan.perez@example.com",
    telefono: "555-1234",
    ciudad: "Bogotá",
  },
  {
    nombre: "Maria Gómez",
    cedula: "87654321",
    correo: "maria.gomez@example.com",
    telefono: "555-5678",
    ciudad: "Medellín",
  },
  // Agrega más datos según sea necesario
];

const TablaClientes: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Hook para navegación

  const [showModalClientes, setShowModalClientes] = useState(false);

  // Define handleEdit and handleDelete with sweetalert2
  const handleEdit = (row: Cliente) => {
    Swal.fire({
      title: `Editando cliente: ${row.nombre}`,
      text: "Deseas editar cliente.",
      icon: "info",
      confirmButtonText: "OK",
    }).then((result: SweetAlertResult) => {
      // Usa SweetAlertResult aquí
      if (result.isConfirmed) {
        // Aquí puedes implementar la lógica para redirigir a una página de edición
        // navigate(`/editar-cliente/${row.cedula}`);
      }
    });
  };

  const handleDelete = (row: Cliente) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar a ${row.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: SweetAlertResult) => {
      // Usa SweetAlertResult aquí
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: `Cliente ${row.nombre} eliminado`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // Aquí puedes implementar la lógica para eliminar el cliente
        // Por ejemplo, podrías hacer una solicitud para eliminar al cliente del servidor
      }
    });
  };

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const handleGoToHome = () => {
    navigate("/home"); // Navega a la ruta de inicio
  };

  const handleOpenModalClientes = () => setShowModalClientes(true);
  const handleCloseModalClientes = () => setShowModalClientes(false);

  // Filtra los datos basado en la búsqueda
  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: Cliente) => row.nombre, sortable: true },
    { name: "Cédula", selector: (row: Cliente) => row.cedula, sortable: true },
    { name: "Correo", selector: (row: Cliente) => row.correo, sortable: true },
    {
      name: "Teléfono",
      selector: (row: Cliente) => row.telefono,
      sortable: true,
    },
    { name: "Ciudad", selector: (row: Cliente) => row.ciudad, sortable: true },
    {
      name: "Editar",
      cell: (row: Cliente) => (
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
      cell: (row: Cliente) => (
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
                <button
                  onClick={handleOpenModalClientes}
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faPlus} /> Añadir Cliente
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
                data={filteredClientes}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalClientes && (
        <FormClientes
          show={showModalClientes}
          handleClose={handleCloseModalClientes}
        />
      )}
    </div>
  );
};

export default TablaClientes;
