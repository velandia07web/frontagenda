import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PricePackJustHour } from "../../servicios/PricesPacks";
import { getAllPacksWithPrice, updatePricePack, PackPriceMap } from "../../servicios/PricesPacks";
import { getAllPacks, Packs } from "../../servicios/Packs";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tableHoursPacks.css";
import Swal from "sweetalert2";
import styled from "styled-components";
import FormPackPrice from "../formPackPrice/formPackPrice";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)``;

const TablaPreciosPack: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProductName, setSelectedProductName] = useState(""); // Estado para el filtro del paquete
  const { idZone } = useParams<{ idZone: string }>();
  const [packs, setPacks] = useState<Array<Packs>>([]);
  const [pricePacks, setPricePacks] = useState<Array<any>>([]);
  const [selectedPricePack, setSelectedPricePack] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = idZone || "";
        const packsData = await getAllPacks();
        const pricePacksData = await getAllPacksWithPrice(id);
        setPricePacks(pricePacksData);
        setPacks(packsData);
      } catch (error) {
        console.error("Error al obtener los datos de price packs:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (pricePack: any) => {
    setSelectedPricePack(pricePack);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductName(e.target.value); // Actualiza el paquete seleccionado
  };

  const columns = [
    {
      name: "Producto",
      selector: (row: PackPriceMap) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Cabina",
      selector: (row: PackPriceMap) => row.idProduct,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row: PackPriceMap) => row.description,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row: PackPriceMap) => row.price,
      sortable: true,
    },
    {
      name: "Precio hora muerta",
      selector: (row: PackPriceMap) => row.priceDeadHour,
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row: PackPriceMap) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  const filteredPricePacks = pricePacks.filter((pricePack) => {
    const matchesSearch = Object.values(pricePack).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    );
    const matchesProductName =
      !selectedProductName || pricePack.name === selectedProductName; // Filtra por nombre del paquete
    return matchesSearch && matchesProductName;
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaPrecios">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="containerPrecios">
            <h1 className="text-center titulo-tabla">Precios de Paquetes</h1>
            <div className="buscador-container">
              <div className="botonesP">
                <select
                  name="productSelect"
                  id="productSelect"
                  value={selectedProductName}
                  onChange={handleProductSelect}
                >
                  <option value="">Cualquiera o elija un producto</option>
                  {Array.from(new Set(packs.map((pack) => pack.name))).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

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
            </div>

            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={filteredPricePacks}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal de edición de precio del paquete */}
      <FormPackPrice
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedPricePack={selectedPricePack} // El objeto debe ser PricePackJustHour
        isEditing={isEditing}
        onSubmit={async (price: number, priceDeadHour: number) => {
          if (selectedPricePack) {
            try {
              // Aquí solo pasamos los valores de price y priceDeadHour
              const updatedPricePack: PricePackJustHour = {
                price,
                priceDeadHour,
              };

              // Llamar a la función de actualización con solo los valores necesarios
              await updatePricePack(selectedPricePack.id, updatedPricePack);

              // Actualizar el estado local con los nuevos precios
              setPricePacks((prev) =>
                prev.map((p) =>
                  p.id === selectedPricePack.id
                    ? { ...p, price, priceDeadHour }
                    : p
                )
              );

              Swal.fire(
                "Actualizado",
                `Precio del paquete actualizado correctamente`,
                "success"
              );
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

export default TablaPreciosPack;
