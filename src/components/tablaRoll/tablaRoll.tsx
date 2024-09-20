// TablaRoll.tsx
import React, { useEffect, useState } from "react";
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
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../servicios/rol"; // Importa el servicio de roles

interface Role {
  id: string;
  name: string;
}

const TablaRoll: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null); // Estado para el rol seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const navigate = useNavigate(); // Hook para navegación
  const [showModalRole, setShowModalRole] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data.data); // Asegúrate de que 'data.data' sea el formato correcto
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los roles",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchRoles();
  }, []);

  const handleEdit = (row: Role) => {
    setSelectedRole(row); // Guarda el rol seleccionado para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalRole(true); // Abre el modal
  };

  const handleCreate = () => {
    setSelectedRole(null); // Resetea el rol seleccionado
    setIsEditing(false); // Activa el modo creación
    setShowModalRole(true); // Abre el modal
  };

  const handleDelete = async (row: Role) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar el rol ${row.name}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await deleteRole(row.id);
          setRoles((prevRoles) => prevRoles.filter((r) => r.id !== row.id));
          Swal.fire({
            title: "Eliminado",
            text: `Rol ${row.name} eliminado`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el rol",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const handleGoToHome = () => {
    navigate("/home"); // Navega a la ruta de inicio
  };

  const handleCloseModalRole = () => {
    setShowModalRole(false);
  };

  const handleSaveRole = async (role: Role | null) => {
    if (role) {
      if (isEditing) {
        try {
          await updateRole(role.id, role.name);
          setRoles((prevRoles) =>
            prevRoles.map((r) => (r.id === role.id ? role : r))
          );
          Swal.fire({
            title: "Actualizado",
            text: `Rol ${role.name} actualizado`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el rol",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        try {
          await createRole(role.name);
          const data = await getRoles();
          setRoles(data.data); // Recargar roles después de la creación
          Swal.fire({
            title: "Creado",
            text: `Rol ${role.name} creado`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo crear el rol",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
    setShowModalRole(false);
  };

  // Filtra los datos basado en la búsqueda
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Nombre", selector: (row: Role) => row.name, sortable: true },
    {
      name: "Editar",
      cell: (row: Role) => (
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
      cell: (row: Role) => (
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
                data={filteredRoles}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalRole && (
        <FormRoll
          show={showModalRole}
          handleClose={handleCloseModalRole}
          role={selectedRole}
          isEditing={isEditing} // Pasa si está en modo edición o no
          onSave={handleSaveRole} // Función para guardar el rol
        />
      )}
    </div>
  );
};

export default TablaRoll;
