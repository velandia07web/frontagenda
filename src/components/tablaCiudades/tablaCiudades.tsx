import React, { useState, useEffect } from "react";
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
  City,
} from "../../servicios/city";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
//import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaCiudades.css";
import FormCiudad from "../formCiudades/formCiudades";
import Swal from "sweetalert2";
import styled from "styled-components";
import { getAllZones, Zone } from "../../servicios/zone";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaCiudad: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState<City | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModalCiudad, setShowModalCiudad] = useState(false);
  const [ciudades, setCiudades] = useState<City[]>([]);
  const [zonas, setZonas] = useState<Zone[]>([]);
  //const navigate = useNavigate();

  const fetchCities = async () => {
    try {
      const [fetchedCities, fetchedZones] = await Promise.all([
        getAllCities(),
        getAllZones(), // Obtener zonas
      ]);
      setCiudades(fetchedCities);
      setZonas(fetchedZones);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleEdit = (ciudad: City) => {
    setSelectedCiudad(ciudad);
    setIsEditing(true);
    setShowModalCiudad(true);
  };

  const handleCreate = () => {
    setSelectedCiudad(null);
    setIsEditing(false);
    setShowModalCiudad(true);
  };

  const handleDelete = async (ciudad: City) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de que deseas eliminar la ciudad ${ciudad.name}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteCity(ciudad.id!); // Elimina utilizando el id que ahora es un string
        setCiudades((prev) => prev.filter((c) => c.id !== ciudad.id));
        Swal.fire("Eliminado", `Ciudad ${ciudad.name} eliminada`, "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la ciudad", "error");
      }
    }
  };

  const handleCloseModalCiudad = () => {
    setShowModalCiudad(false);
    setSelectedCiudad(null);
  };

  const handleModalSubmit = async (ciudad: City) => {
    try {
      if (isEditing && selectedCiudad) {
        const updatedCity = await updateCity(selectedCiudad.id!, ciudad); // Asegúrate de que updateCity esté ajustado para manejar el id como string
        setCiudades((prev) =>
          prev.map((c) => (c.id === selectedCiudad.id ? updatedCity : c))
        );
        Swal.fire(
          "Actualizado",
          `Ciudad ${ciudad.name} actualizada`,
          "success"
        );
      } else {
        const newCity = await createCity(ciudad); // Asegúrate de que createCity maneje el idZone
        setCiudades((prev) => [...prev, newCity]);
        Swal.fire("Creado", `Ciudad ${ciudad.name} creada`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la ciudad", "error");
    } finally {
      handleCloseModalCiudad();
      fetchCities();
    }
  };

  const filteredCiudades = ciudades.filter((ciudad) =>
    Object.values(ciudad).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      name: "Nombre Ciudad",
      selector: (row: City) => row.name,
      sortable: true,
    },
    {
      name: "Zona", // Cambiar "ID Zona" a "Zona"
      selector: (row: City) => {
        const zone = zonas.find((z) => z.id === row.idZone); // Buscar la zona por ID
        return zone ? zone.name : "No asignada"; // Devolver el nombre de la zona o un valor por defecto
      },
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row: City) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: City) => (
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
          <div className="containerCiudad">
            <h1 className="text-center titulo-tabla">Tabla de Ciudades</h1>{" "}
            <div className="botonesC">
              {/* <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FontAwesomeIcon icon={faUsers} />
              </button> */}
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>crear Ciudad</h6>
              </button>
              <div className="BuscadorC">
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
                data={filteredCiudades}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {showModalCiudad && (
        <FormCiudad
          show={showModalCiudad}
          handleClose={handleCloseModalCiudad}
          selectedCiudad={selectedCiudad}
          isEditing={isEditing}
          onSubmit={handleModalSubmit} 
        />
      )}
    </div>
  );
};

export default TablaCiudad;
