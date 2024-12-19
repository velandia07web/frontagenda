import React, { useState, useEffect } from "react";
import { getAllAdds, createAdd, updateAdd, deleteAdd, Adds } from "../../servicios/Adds";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaAdds.css";
import Swal from "sweetalert2";
import styled from "styled-components";
import FormAdds from "../formAdds/formAdds";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
// Estilos personalizados para la tabla
`;

const TablaAdds: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAdd, setSelectedAdd] = useState<Adds | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adds, setAdds] = useState<Array<Adds>>([]);
  const [showForm, setShowForm] = useState(false); // Estado para controlar el modal
  const [typePrices, setTypePrices] = useState<Array<TypePrices>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addsData = await getAllAdds();
        const TypePricesData = await getAllTypePrices();
        setAdds(addsData);
        setTypePrices(TypePricesData)
      } catch (error) {
        console.error("Error al obtener adicionales:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (add: Adds) => {
    setSelectedAdd(add);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedAdd(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = async (add: Adds) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de cambiar el estado del adicional ${add.name}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteAdd(add.id!);
        setAdds((prev) => prev.filter((a) => a.id !== add.id));
        Swal.fire("Estado cambiado", `Adicional ${add.name} cambiado`, "success");
        window.location.reload()
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar el estado del adicional", "error");
      }
    }
  };

  const handleSubmit = async (add: Adds) => {
    try {
      if (isEditing && selectedAdd) {
        const updatedAdd = await updateAdd(selectedAdd.id!, add);
        setAdds((prev) => prev.map((a) => (a.id === selectedAdd.id ? updatedAdd : a)));
        Swal.fire("Actualizado", `Adicional ${add.name} actualizado`, "success");
      } else {
        const newAdd = await createAdd(add);
        setAdds((prev) => [...prev, newAdd]);
        Swal.fire("Creado", `Adicional ${add.name} creado`, "success");
      }
      setShowForm(false); // Cerrar el modal después de guardar
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el adicional", "error");
    }
  };

  const filteredAdds = adds.filter((add) =>
    Object.values(add).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      name: "Nombre Adicional",
      selector: (row: Adds) => row.name,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row: Adds) => row.price,
      sortable: true,
    },
    {
      name: "Tipo de precio",
      selector: (row: Adds) => {
        const typePrice = typePrices.find((type) => type.id === row.idTypePrice);
        return typePrice ? typePrice.name : "No asignado"; // Devuelve el nombre o un valor por defecto
      },
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: Adds) => (
        <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.state}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Editar",
      cell: (row: Adds) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: Adds) => (
        <button className="btn btn-link" onClick={() => handleDelete(row)}>
          <FontAwesomeIcon icon={faPowerOff} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaAdds">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="containerAdds">
            <h1 className="text-center titulo-tabla">Tabla de Adicionales</h1>
            <div className="botonesC">
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>Crear Nuevo</h6>
              </button>
              <div className="BuscadorP">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={filteredAdds}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <FormAdds
          show={showForm}
          handleClose={() => setShowForm(false)}
          selectedAdd={selectedAdd}
          isEditing={isEditing}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TablaAdds;
