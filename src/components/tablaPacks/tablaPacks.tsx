import React, { useState, useEffect } from "react";
import { Packs,
  createPack,
  deletePack,
  getAllPacks,
  updatePack
 } from "../../servicios/Packs";
import { getAllZones, 
  Zone 
} from "../../servicios/zone";
import { Product, 
  getAllProducts 
} from "../../servicios/products";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaPacks.css";
import FormPacks from "../formPacks/formPacks";
import Swal from "sweetalert2";
import styled from "styled-components";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Estilos personalizados para la tabla
`;

const TablaPacks: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPack, setSelectedPack] = useState<Packs | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModalPack, setShowModalPack] = useState(false); // Renombrado a showModalPack
  const [packs, setPacks] = useState<Packs[]>([]);
  const [zonas, setZonas] = useState<Zone[]>([]);
  const [products, setProducts] =useState<Array<Product>>([])

  const fetchPacks = async () => {
    try {
      const [fetchedPacks, fetchedZones, fetchedProducts] = await Promise.all([
        getAllPacks(),
        getAllZones(),
        getAllProducts()
      ]);
      setPacks(fetchedPacks);
      setZonas(fetchedZones);
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Error al obtener los packs:", error);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleEdit = (pack: Packs) => {
    setSelectedPack(pack);
    setIsEditing(true);
    setShowModalPack(true); // Renombrado
  };

  const handleCreate = () => {
    setSelectedPack(null);
    setIsEditing(false);
    setShowModalPack(true); // Renombrado
  };

  const handleDelete = async (pack: Packs) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de cambiar el estado del pack ${pack.name}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePack(pack.id!);
        setPacks((prev) => prev.filter((p) => p.id !== pack.id));
        Swal.fire("Estado cambiado", `Pack ${pack.name} cambiado`, "success");
        window.location.reload()
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar el estado del pack", "error");
      }
    }
  };

  const handleCloseModalPack = () => { // Renombrado
    setShowModalPack(false); // Renombrado
    setSelectedPack(null);
  };

  const handleModalSubmit = async (pack: Packs) => {
    try {
      if (isEditing && selectedPack) {
        const updatedPack = await updatePack(selectedPack.id!, pack);
        setPacks((prev) =>
          prev.map((p) => (p.id === selectedPack.id ? updatedPack : p))
        );
        Swal.fire("Actualizado", `Pack ${pack.name} actualizado`, "success");
      } else {
        const newPack = await createPack(pack);
        setPacks((prev) => [...prev, newPack]);
        Swal.fire("Creado", `Pack ${pack.name} creado`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el pack", "error");
    } finally {
      handleCloseModalPack();
      fetchPacks();
    }
  };

  const filteredPacks = packs.filter((pack) =>
    Object.values(pack).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      name: "Nombre Pack",
      selector: (row: Packs) => row.name,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row: Packs) => row.description,
      sortable: true,
    },
    {
    name: "Estado",
    cell: (row: Packs) => (
      <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
        <p>{row.state}</p>
      </div>
    ),
    ignoreRowClick: true,
                   },
    {
      name: "Cabina",
      selector: (row: Packs) => 
        products.find((product) => product.id === row.idProduct)?.name || "Sin zona",
      sortable: true,
    },
    {
      name: "Zona",
      selector: (row: Packs) =>
        zonas.find((zona) => zona.id === row.idZone)?.name || "Sin zona",
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row: Packs) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: Packs) => (
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
      <div className="d-flex flex-grow-1 tablaPacks">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="containerPacks">
            <h1 className="text-center titulo-tabla">Tabla de Packs</h1>
            <div className="botonesP">
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>crear nuevo</h6>
              </button>
              <div className="BuscadorP">
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
                data={filteredPacks}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {showModalPack && ( // Renombrado
        <FormPacks
          show={showModalPack} // Renombrado
          handleClose={handleCloseModalPack} // Renombrado
          selectedPack={selectedPack}
          isEditing={isEditing}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TablaPacks;
