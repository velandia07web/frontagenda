import React, { useState, useEffect } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
//import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaRedSocial.css"; // Importa el archivo CSS
import Swal from "sweetalert2";
import styled from "styled-components";
import FormRedSocial from "../formRedSocial/formRedSocial";
import {
  getAllSocialMedias,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  SocialMedia,
} from "../../servicios/socialMedia";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí puedes agregar tus estilos personalizados
`;

const TablaRed: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRed, setSelectedRed] = useState<SocialMedia | null>(null); // Estado para la red social seleccionada
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos en modo edición o creación
  const [showModalRed, setShowModalRed] = useState(false); // Estado para mostrar el modal
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]); // Estado para almacenar las redes sociales
  //const navigate = useNavigate(); // Hook para navegación

  // Cargar las redes sociales cuando el componente se monta
  const fetchSocialMedias = async () => {
    try {
      const data = await getAllSocialMedias();
      setSocialMedias(data); // Actualiza el estado con las redes sociales obtenidas
    } catch (error) {
      console.error("Error al obtener redes sociales:", error);
    }
  };

  useEffect(() => {
    fetchSocialMedias();
  }, []);

  const handleEdit = (row: SocialMedia) => {
    setSelectedRed(row); // Guarda la red social seleccionada para editar
    setIsEditing(true); // Activa el modo edición
    setShowModalRed(true); // Abre el modal
  };

  const handleCreate = () => {
    setSelectedRed(null); // Resetea la red social seleccionada
    setIsEditing(false); // Activa el modo creación
    setShowModalRed(true); // Abre el modal
  };

  const handleDelete = async (row: SocialMedia) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de cambiar el estado de ${row.name}?`,
      text: "Esta acción podría afectar otros procesos y usuarios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteSocialMedia(row.id!);
        setSocialMedias((prev) =>
          prev.filter((socialMedia) => socialMedia.id !== row.id)
        );
        Swal.fire("Estado cambiado", `Red social ${row.name} cambiada`, "success");
        window.location.reload()
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar el estado de la red social", "error");
      }
    }
  };

  const handleCloseModalRed = () => {
    setShowModalRed(false);
    setSelectedRed(null);
  };

  const handleModalSubmit = async (socialMedia: SocialMedia) => {
    try {
      if (isEditing && selectedRed) {
        const updatedSocialMedia = await updateSocialMedia(
          selectedRed.id!,
          socialMedia
        );
        setSocialMedias((prev) =>
          prev.map((sm) => (sm.id === selectedRed.id ? updatedSocialMedia : sm))
        );
        Swal.fire(
          "Actualizado",
          `Red social ${socialMedia.name} actualizada`,
          "success"
        );
      } else {
        const newSocialMedia = await createSocialMedia(socialMedia);
        setSocialMedias((prev) => [...prev, newSocialMedia]);
        Swal.fire("Creado", `Red social ${socialMedia.name} creada`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la red social", "error");
    } finally {
      handleCloseModalRed();
      fetchSocialMedias();
    }
  };

  const filteredSocialMedias = Array.isArray(socialMedias)
    ? socialMedias.filter((socialMedia) =>
      Object.values(socialMedia).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    : [];

  const columns = [
    {
      name: "Nombre",
      selector: (row: SocialMedia) => row.name,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: SocialMedia) => (
        <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.state}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Editar",
      cell: (row: SocialMedia) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: SocialMedia) => (
        <button
          className="btn btn-link eliminar"
          onClick={() => handleDelete(row)}
        >
          <FontAwesomeIcon icon={faPowerOff} />
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
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""
            }`}
        >
          <div className="containerRed">
            <h1 className="text-center titulo-tabla">Tabla de Redes</h1>{" "}
            {/* Título centrado */}
            <div className="botonesR">
              {/* <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FontAwesomeIcon icon={faUsers} /> Regresar
              </button> */}
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>crear Red</h6>
              </button>
              <div className="BuscadorR">
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
                data={filteredSocialMedias}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalRed && (
        <FormRedSocial
          show={showModalRed}
          handleClose={handleCloseModalRed}
          selectedSocial={selectedRed}
          isEditing={isEditing}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TablaRed;
