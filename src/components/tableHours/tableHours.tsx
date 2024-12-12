import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllProductsWithPrice, productPrice, putProductPrice,deleteProductPrice } from "../../servicios/products";
import { getAllProducts, Product } from "../../servicios/products";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tableHours.css";
import Swal from "sweetalert2";
import styled from "styled-components";
import FormProductPrice from "../formProductPrice/formProductPrice";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)``;

const TablaPrecios: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [productsPrice, setProductsPrice] = useState<Array<productPrice>>([]);
  const [products, setProduct] = useState<Array<Product>>([]);
  const [typePrices, setTypePrices] = useState<Array<TypePrices>>([]);
  const { idZone } = useParams<{ idZone: string }>();
  const [selectedProduct, setSelectedProduct] = useState<productPrice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [selectedPriceType, setSelectedPriceType] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = idZone || "";
        const productsPricesData = await getAllProductsWithPrice(id);
        const productsData = await getAllProducts();
        const typePricesData = await getAllTypePrices();
        setProductsPrice(productsPricesData);
        setProduct(productsData);
        setTypePrices(typePricesData);
      } catch (error) {
        console.error("Error al obtener precios por zona:", error);
      }
    };
    fetchData();
  }, [idZone]);

  const handleEdit = (product: productPrice) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (product: productPrice) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de que deseas eliminar el producto ${product.name}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        // Eliminar el producto en el servidor
        await deleteProductPrice(product.id || "");  // Asegúrate de pasar el id del producto
  
        // Actualizar el estado de los productos eliminando el producto
        setProductsPrice((prev) => prev.filter((p) => p.id !== product.id));
  
        // Mostrar mensaje de éxito
        Swal.fire("Eliminado", `Producto ${product.name} eliminado`, "success");
      } catch (error) {
        // En caso de error, mostrar mensaje de fallo
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };
  

  const findPriceTypeId = (typeName: string): string | null => {
    const foundType = typePrices.find(type => 
      type.name.toLowerCase().includes(typeName.toLowerCase())
    );
    return foundType?.id ?? null;
  };

  const handlePriceTypeFilter = (typeName: string) => {
    const typeId = findPriceTypeId(typeName);
    setSelectedPriceType(typeId);
  };

  const handleResetPriceTypeFilter = () => {
    setSelectedPriceType(null);
  };

  const filteredProducts = productsPrice.filter((product) => {
    const matchesProductName = 
      product.name.toLowerCase().includes(selectedProductName.toLowerCase());
    
    const matchesSearch = 
      Object.values(product).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      );
    
    const matchesPriceType = 
      selectedPriceType === null || 
      (product.typePrice !== undefined && product.typePrice === selectedPriceType);
    
    return matchesProductName && matchesSearch && matchesPriceType;
  });

  const handleProductSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductName(event.target.value);
  };

  const columns = [
    {
      name: "Nombre del Producto",
      selector: (row: productPrice) => row.name,
      sortable: true,
    },
    {
      name: "Hora",
      selector: (row: productPrice) => row.hour,
      sortable: true,
    },
    {
      name: "Tipo de precio",
      selector: (row: productPrice) => {
        const typePrice = typePrices.find(type => type.id === row.typePrice);
        return typePrice ? typePrice.name : "Desconocido";
      },
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row: productPrice) => row.price,
      sortable: true,
    },
    {
      name: "Precio Hora Muerta",
      selector: (row: productPrice) => row.priceDeadHour,
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row: productPrice) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: productPrice) => (
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
      <div className="d-flex flex-grow-1 tablaPrecios">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="containerPrecios">
            <h1 className="text-center titulo-tabla">Precios por Zona</h1>
            <div className="botonesP">
              <select
                name="productSelect"
                id="productSelect"
                value={selectedProductName}
                onChange={handleProductSelect}
              >
                <option value="">Cualquiera o elija un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>

              <button 
                className={`btn ${selectedPriceType === findPriceTypeId('descuento') ? 'btn-success' : 'btn-primary'} withoutSpace`}
                onClick={() => handlePriceTypeFilter('descuento')}
              >
                Precio con descuento
              </button>
              <button 
                className={`btn ${selectedPriceType === findPriceTypeId('público') ? 'btn-success' : 'btn-primary'} withoutSpace`}
                onClick={() => handlePriceTypeFilter('público')}
              >
                Precio público
              </button>
              {selectedPriceType && (
                <button 
                  className="btn btn-secondary withoutSpace ml-2"
                  onClick={handleResetPriceTypeFilter}
                >
                  Limpiar Filtro
                </button>
              )}
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
                data={filteredProducts}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal de edición de precio del producto */}
      <FormProductPrice
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedPrice={selectedProduct}
        isEditing={isEditing}
        onSubmit={async (price: number, priceDeadHour: number) => {
          if (selectedProduct) {
            try {
              
              // Actualiza el estado de productos precios
              setProductsPrice(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, price, priceDeadHour } : p));
              // Llamada al servicio putProductPrice para actualizar el precio

              await putProductPrice(selectedProduct.id || "", price, priceDeadHour);

              Swal.fire("Actualizado", `Precio del producto ${selectedProduct.name} actualizado`, "success");
              setShowModal(false);
            } catch (error) {
              Swal.fire("Error", "No se pudo actualizar el precio", "error");
            }
          }
        }}
      />
    </div>
  );
};

export default TablaPrecios;
