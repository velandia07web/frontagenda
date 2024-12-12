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
import "./tablaClientes.css"; // Importa el archivo CSS
import FormClientes from "../formClientes/formClientes";
import Swal, { SweetAlertResult } from "sweetalert2"; // Importa sweetalert2 y el tipo SweetAlertResult
import styled from "styled-components";
import { Client, getAllClients, deleteClient } from "../../servicios/clients";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaClientes: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [showModalClientes, setShowModalClientes] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [clientList, setClientList] = useState<Array<Client>>(); // Lista dinámica de clientes
  const navigate = useNavigate();

  const handleToggleMenu = (isExpanded: boolean) => setIsSlideMenuExpanded(isExpanded);
  const handleGoToHome = () => navigate("/home");

  const handleOpenModalClientes = (client?: Client) => {
    setSelectedClient(client); // Establece el cliente seleccionado o ninguno
    setShowModalClientes(true);
  };

  const handleCloseModalClientes = () => {
    setShowModalClientes(false);
    setSelectedClient(undefined); // Limpia el cliente seleccionado
  };

  const handleSaveClient = (newClient: Client) => {
    console.log('Saving client:', newClient);
  
    if (newClient.id) {
      // Update existing client
      setClientList((prevClients) => {
        if (!prevClients) return [newClient];
        
        const updatedClients = prevClients.map((client) => 
          client.id === newClient.id ? newClient : client
        );
        
        console.log('Updated client list:', updatedClients);
        return updatedClients;
      });
    } else {
      // Add new client
      setClientList((prevClients) => {
        const newClientList = [...(prevClients || []), newClient];
        console.log('New client list:', newClientList);
        return newClientList;
      });
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await getAllClients()
        setClientList(clientsData)
      } catch (error) {
        console.error("Error al obtener todos los clientes; ", error)
      }
    }

    fetchData()
  }, [])

  const handleDelete = (row: Client) => {
    Swal.fire({
      title: `¿Estás seguro de que deseas eliminar a ${row.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          // Llamar a la función deleteClient para eliminar el cliente en la base de datos
          await deleteClient(row.id || "");
  
          // Mostrar el mensaje de éxito
          Swal.fire({
            title: "Eliminado",
            text: `Cliente ${row.name} eliminado`,
            icon: "success",
            confirmButtonText: "OK",
          });
  
          // Actualizar la lista de clientes (eliminando al cliente localmente)
          setClientList(clientList?.filter((client) => client.id !== row.id));
        } catch (error) {
          // Manejo de errores si la eliminación falla
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el cliente.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error al eliminar el cliente:", error);
        }
      }
    });
  };
  

  const filteredClientes = clientList?.filter((cliente) =>
    Object.values(cliente).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: Client) => row.name, sortable: true },
    { name: "Apellido", selector: (row: Client) => row.lastName, sortable: true },
    { name: "Compañia", selector: (row: Client) => row.idCompany, sortable: true },
    { name: "Correo", selector: (row: Client) => row.email, sortable: true },
    { name: "Documento de la persona a cargo", selector: (row: Client) => row.CC, sortable: true },
    { name: "Cupo", selector: (row: Client) => row.cupoDisponible, sortable: true },
    { name: "Cupo ocupado", selector: (row: Client) => row.cupoCopado, sortable: true },
    {
      name: "Editar",
      cell: (row: Client) => (
        <button className="btn btn-link" onClick={() => handleOpenModalClientes(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: Client) => (
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
        <SlideMenu onToggleMenu={handleToggleMenu} />
        <main className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}>
          <div className="container mt-4">
            <div className="botones">
              <div className="botonR">
                <button className="btn btn-primary" onClick={handleGoToHome}>
                  <FontAwesomeIcon icon={faUsers} /> Regresar
                </button>
              </div>

              <div className="botonA">
                <button
                  onClick={() => handleOpenModalClientes()}
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
              <StyledDataTable
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
          clientData={selectedClient}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
};

export default TablaClientes;
