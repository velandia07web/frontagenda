import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../../servicios/products";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
//import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaProductos.css";
import FormProducto from "../formProductos/formProductos";
import Swal from "sweetalert2";
import styled from "styled-components";
import { getAllZones, Zone } from "../../servicios/zone";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Estilos personalizados para la tabla
`;

const TablaProductos: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProducto, setSelectedProducto] = useState<Product | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showModalProducto, setShowModalProducto] = useState(false);
  const [productos, setProductos] = useState<Product[]>([]);
  const [zonas, setZonas] = useState<Zone[]>([]);
  //const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const [fetchedProducts, fetchedZones] = await Promise.all([
        getAllProducts(),
        getAllZones(), // Fetch zones for assigning product zones
      ]);
      setProductos(fetchedProducts);
      setZonas(fetchedZones);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (producto: Product) => {
    setSelectedProducto(producto);
    setIsEditing(true);
    setShowModalProducto(true);
  };

  const handleCreate = () => {
    setSelectedProducto(null);
    setIsEditing(false);
    setShowModalProducto(true);
  };

  const handleDelete = async (producto: Product) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de cambiar el estado del producto ${producto.name}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(producto.id!);
        setProductos((prev) => prev.filter((p) => p.id !== producto.id));
        Swal.fire(
          "Estado cambiado",
          `Producto ${producto.name} cambiado`,
          "success"
        );
        window.location.reload()
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar el estado del producto", "error");
      }
    }
  };

  const handleCloseModalProducto = () => {
    setShowModalProducto(false);
    setSelectedProducto(null);
  };

  const handleModalSubmit = async (producto: Product) => {
    try {
      if (isEditing && selectedProducto) {
        const updatedProduct = await updateProduct(
          selectedProducto.id!,
          producto
        );
        setProductos((prev) =>
          prev.map((p) => (p.id === selectedProducto.id ? updatedProduct : p))
        );
        Swal.fire(
          "Actualizado",
          `Producto ${producto.name} actualizado`,
          "success"
        );
      } else {
        const newProduct = await createProduct(producto);
        setProductos((prev) => [...prev, newProduct]);
        Swal.fire("Creado", `Producto ${producto.name} creado`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    } finally {
      handleCloseModalProducto();
      fetchProducts();
    }
  };


  const filteredProductos = productos.filter((producto) =>
    Object.values(producto).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      name: "Nombre Producto",
      selector: (row: Product) => row.name,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row: Product) => row.description,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: Product) => (
        <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.state}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Imagen",
      selector: (row: Product) => (
        <img
          src={row.imagen}
          alt={row.name}
          className="img-thumbnail"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      name: "Cantidad",
      selector: (row: Product) => row.count,
      sortable: true,
    },
    {
      name: "Zona",
      selector: (row: Product) =>
        zonas.find((zona) => zona.id === row.idZone)?.name || "Sin zona",
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row: Product) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: Product) => (
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
      <div className="d-flex flex-grow-1 tablaProductos">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""
            }`}
        >
          <div className="containerProductos">
            <h1 className="text-center titulo-tabla">Tabla de cabinas</h1>{" "}
            <div className="botonesP">
              {/* <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FontAwesomeIcon icon={faBox} />
              </button> */}
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
                data={filteredProductos}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {showModalProducto && (
        <FormProducto
          show={showModalProducto}
          handleClose={handleCloseModalProducto}
          selectedProducto={selectedProducto}
          isEditing={isEditing}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TablaProductos;
