import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
  CreateUserPayload,
} from "../../servicios/user";
import { getAllZones, Zone } from "../../servicios/zone";
import { getAllRoles, Role } from "../../servicios/rol"; // Servicios de roles
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaEquipo.css";
import FormEquipo from "../formEquipoTrabajo/equipoTrabajo";
import Swal from "sweetalert2";
import styled from "styled-components";

// Componente para estilizar la tabla
const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaEquipo: React.FC = () => {
  // Estados locales
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Función para obtener usuarios, zonas y roles al cargar la página
  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedZones, fetchedRolesResponse] =
        await Promise.all([
          getAllUsers(), // Se espera que este retorne un array de usuarios
          getAllZones(), // Se espera que este retorne un array de zonas
          getAllRoles(), // Se espera que este retorne un objeto RolesResponse
        ]);

      // Asignar los arrays de datos directamente
      setUsers(fetchedUsers); // Ajuste para usuarios
      setZones(fetchedZones); // Ajuste para zonas
      setRoles(fetchedRolesResponse.data.rows); // Ajuste para roles
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Maneja la edición
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowModalUser(true);
  };

  // Maneja la creación de un nuevo usuario
  const handleCreate = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowModalUser(true);
  };

  // Maneja la eliminación de un usuario
  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de que deseas eliminar al usuario ${user.name}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed && user.id) {
      try {
        await deleteUser(user.id!);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        Swal.fire("Eliminado", `Usuario ${user.name} eliminado`, "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  // Cierra el modal de usuarios
  const handleCloseModalUser = () => {
    setShowModalUser(false);
    setSelectedUser(null);
  };

  // Maneja el submit del modal de creación/edición de usuarios
  const handleModalSubmit = async (user: User, password?: string) => {
    try {
      if (isEditing && selectedUser) {
        const updatedUser = await updateUser(selectedUser.id, user);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
        );
        Swal.fire("Actualizado", `Usuario ${user.name} actualizado`, "success");
      } else if (password) {
        const newUserPayload: CreateUserPayload = { ...user, password };
        const newUser = await createUser(newUserPayload);
        setUsers((prev) => [...prev, newUser]);
        Swal.fire("Creado", `Usuario ${user.name} creado`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo procesar el usuario", "error");
    } finally {
      handleCloseModalUser(); // Cierra el modal al finalizar la acción
      fetchData(); // Recargar los datos para reflejar los cambios
    }
  };

  // Filtra usuarios por búsqueda
  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Definición de las columnas de la tabla
  const columns = [
    { name: "Nombre", selector: (row: User) => row.name, sortable: true },
    { name: "Apellido", selector: (row: User) => row.lastName },
    { name: "Email", selector: (row: User) => row.email },
    { name: "Cedula", selector: (row: User) => row.cedula },
    { name: "Telefono", selector: (row: User) => row.phone },
    {
      name: "Rol",
      selector: (row: User) => {
        const role = roles.find((r) => r.id === String(row.idRol));
        return role ? role.name : "Sin Rol";
      },
    },
    {
      name: "Zona",
      selector: (row: User) => {
        const zone = zones.find((z) => z.id === String(row.idZone));
        return zone ? zone.name : "Sin Zona";
      },
    },
    {
      name: "Editar",
      cell: (row: User) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: User) => (
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
      <div className="d-flex flex-grow-1">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${
            isSlideMenuExpanded ? "expanded" : ""
          }`}
        >
          <div className="container mt-4">
            <h1>Equipo de Trabajo</h1>
            <div className="botones mb-4">
              <button className="btn btn-primary" onClick={handleCreate}>
                <FontAwesomeIcon icon={faPlus} /> Crear Usuario
              </button>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <StyledDataTable
              columns={columns}
              data={filteredUsers}
              pagination
            />
          </div>
        </main>
      </div>

      {/* Modal para crear/editar usuarios */}
      {showModalUser && (
        <FormEquipo
          show={showModalUser}
          handleClose={handleCloseModalUser}
          equipo={selectedUser}
          isEditing={isEditing}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TablaEquipo;
