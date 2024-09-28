import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFileAlt,
  faCalendarAlt,
  faUsers,
  faChevronDown,
  faChevronUp,
  faMinus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./SlideMenu.css";
//import FormEquipo from "../formEquipoTrabajo/equipoTrabajo";
import FormClientes from "../formClientes/formClientes";
//import FormCiudad from "../formCiudades/formCiudades";
import FormInventario from "../formInventario/formInventario";
//import FormRoll from "../formRoll/formRoll";
//import FormRed from "../formRedSocial/formRedSocial";
/* import FormZona from "../formZonas/formZonas"; */
import { useNavigate } from "react-router-dom"; // Importar useNavigate

interface SlideMenuProps {
  onToggleMenu: (isExpanded: boolean) => void;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onToggleMenu }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({
    formularios: false,
    agenda: false,
    usuarios: false,
  });
  const navigate = useNavigate();

  /* const [showModalroll, setShowModalroll] = useState(false); */
  /*  const [showModalEquipo, setShowModalEquipo] = useState(false); */
  /* const [showModalRed, setShowModalRed] = useState(false); */
  /*  const [showModalZona, setShowModalZona] = useState(false); */
  /* const [showModalCiudad, setShowModalCiudad] = useState(false); */
  const [showModalClientes, setShowModalClientes] = useState(false);
  const [showModalInventario, setShowModalInventario] = useState(false);

  const toggleMenu = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    onToggleMenu(newIsExpanded);
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      setIsHovered(false);
    }
  };

  const toggleSubMenu = (menu: keyof typeof isSubMenuOpen) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // constane para navegar en las tablas y vistas al dar click en slide
  const handleNavigateToTablaRoll = () => {
    navigate("/roll"); // Redirige a la vista de Tabla
  };

  const handleNavigateToTablaequipo = () => {
    navigate("/equipo"); // Redirige a la vista de Tabla
  };

  const handleNavigateToTablaRed = () => {
    navigate("/red"); // Redirige a la vista de Tabla
  };

  const handleNavigateToTablaZona = () => {
    navigate("/zona"); // Redirige a la vista de Tabla
  };

  const handleNavigateToTablaCiudad = () => {
    navigate("/ciudad"); // Redirige a la vista de Tabla
  };

  const handleNavigateToTablaclientes = () => {
    navigate("/clientes"); // Redirige a la vista de Tabla Roll
  };

  const handleNavigateToTablaProductos = () => {
    navigate("/TablaProductos"); // Redirige a la vista de Tabla
  };

  /* // logica para recibir datos al modal
  const [isEditingRoll, setIsEditingRoll] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState<{
    nombreRoll: string;
  } | null>(null); */

  /*  const [isEditingequipo, setIsEditingequipo] = useState(false);
  const [selectedequipo, setSelectedequipo] = useState<{
    nombre: string;
    email: string;
    cedula: number;
    telefono: string;
    rol: string;
    zona: string;
  } | null>(null); */

  /* const [isEditingRed, setIsEditingRed] = useState(false);
  const [selectedRed, setSelectedRed] = useState<{
    nombreRed: string;
  } | null>(null); */

  /*  const [isEditingZona, setIsEditingZona] = useState(false);
  const [selectedZona, setSelectedZona] = useState<{
    nombreZona: string;
  } | null>(null); */

  /* const [isEditingCiudad, setIsEditingCiudad] = useState(false);
  const [selectedCiudad, setSelectedCiudad] = useState<{
    nombreCiudad: string;
    nombreZona: string;
  } | null>(null); */

  // logica modal de formularios roll
  /* const handleOpenCreateRollModal = () => {
    setSelectedRoll(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingRoll(false); // No estamos editando
    setShowModalroll(true); // Abre el modal
  };

  const handleCloseModalroll = () => {
    setShowModalroll(false); // Cierra el modal
    setIsEditingRoll(false); // Resetea el modo edición
    setSelectedRoll(null); // Resetea el rol seleccionado
  }; */

  // modal equipo trabajo
  /*  const handleOpenCreateequipoModal = () => {
    setSelectedequipo(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingequipo(false); // No estamos editando
    setShowModalEquipo(true); // Abre el modal
  };
  const handleCloseModalequipo = () => {
    setShowModalEquipo(false); // Cierra el modal
    setIsEditingequipo(false); // Resetea el modo edición
    setSelectedequipo(null); // Resetea el rol seleccionado
  }; */

  // modal Red Conexion
  /*  const handleOpenCreateRedModal = () => {
    setSelectedRed(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingRed(false); // No estamos editando
    setShowModalRed(true); // Abre el modal
  }; */
  /* const handleCloseModalRed = () => {
    setShowModalRed(false); // Cierra el modal
    setIsEditingRed(false); // Resetea el modo edición
    setSelectedRed(null); // Resetea el rol seleccionado
  }; */

  /*  // modal Zona
  const handleOpenCreateZonaModal = () => {
    setSelectedZona(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingZona(false); // No estamos editando
    setShowModalZona(true); // Abre el modal
  }; */
  /* const handleCloseModalZona = () => {
    setShowModalZona(false); // Cierra el modal
    setIsEditingZona(false); // Resetea el modo edición
    setSelectedZona(null); // Resetea el rol seleccionado
  }; */

  // modal ciudad
  /* const handleOpenCreateCiudadModal = () => {
    setSelectedCiudad(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingCiudad(false); // No estamos editando
    setShowModalCiudad(true); // Abre el modal
  };
  const handleCloseModalCiudad = () => {
    setShowModalCiudad(false); // Cierra el modal
    setIsEditingCiudad(false); // Resetea el modo edición
    setSelectedCiudad(null); // Resetea el rol seleccionado
  }; */

  const handleOpenModalClientes = () => setShowModalClientes(true);
  const handleCloseModalClientes = () => setShowModalClientes(false);
  const handleOpenModalInventario = () => setShowModalInventario(true);
  const handleCloseModalInventario = () => setShowModalInventario(false);

  return (
    <>
      <div
        className={`slide-menu-container ${
          isExpanded ? "expanded" : "collapsed"
        }`}
        style={
          {
            "--slide-menu-width": isExpanded ? "250px" : "60px",
          } as React.CSSProperties
        }
      >
        <div className={`menu-header ${isExpanded ? "expanded" : "collapsed"}`}>
          <div className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isExpanded ? faBars : faTimes} />
          </div>
        </div>

        <div
          className={`slide-menu ${
            isExpanded || isHovered ? "expanded" : "collapsed"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="menu-items">
            <li>
              <div
                onClick={() => toggleSubMenu("formularios")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                {(isExpanded || isHovered) && (
                  <>
                    <span> Formularios</span>
                    <FontAwesomeIcon
                      icon={
                        isSubMenuOpen.formularios ? faChevronUp : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.formularios && (isExpanded || isHovered) && (
                <ul className="submenu">
                  {/* <li onClick={handleOpenCreateRollModal}>
                    <FontAwesomeIcon icon={faMinus} /> Crear Roll
                  </li> */}

                  {/*  <li onClick={handleOpenCreateRedModal}>
                    <FontAwesomeIcon icon={faMinus} /> Crear Red De Conexion
                  </li> */}

                  {/* <li onClick={handleOpenCreateZonaModal}>
                    <FontAwesomeIcon icon={faMinus} /> Crear Zona
                  </li> */}

                  {/*  <li onClick={handleOpenCreateCiudadModal}>
                    <FontAwesomeIcon icon={faMinus} /> Ciudades
                  </li> */}

                  {/* <li onClick={handleOpenCreateequipoModal}>
                    <FontAwesomeIcon icon={faMinus} /> Equipo de Trabajo
                  </li> */}

                  <li onClick={handleOpenModalClientes}>
                    <FontAwesomeIcon icon={faMinus} /> Clientes
                  </li>

                  <li onClick={handleOpenModalInventario}>
                    <FontAwesomeIcon icon={faMinus} /> Inventario
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleSubMenu("agenda")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {(isExpanded || isHovered) && (
                  <>
                    <span>Agenda</span>
                    <FontAwesomeIcon
                      icon={isSubMenuOpen.agenda ? faChevronUp : faChevronDown}
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.agenda && (isExpanded || isHovered) && (
                <ul className="submenu">
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Ventas</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Eventos</span>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleSubMenu("usuarios")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faUsers} />
                {(isExpanded || isHovered) && (
                  <>
                    <span>Tablas Maestras</span>
                    <FontAwesomeIcon
                      icon={
                        isSubMenuOpen.usuarios ? faChevronUp : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.usuarios && (isExpanded || isHovered) && (
                <ul className="submenu">
                  <li onClick={handleNavigateToTablaRoll}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Tabla Roll</span>
                  </li>

                  <li onClick={handleNavigateToTablaRed}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Red De Conexion</span>
                  </li>

                  <li onClick={handleNavigateToTablaZona}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Zonas</span>
                  </li>

                  <li onClick={handleNavigateToTablaCiudad}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Ciudad</span>
                  </li>

                  <li onClick={handleNavigateToTablaequipo}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Equipo de Trabajo</span>
                  </li>

                  <li onClick={handleNavigateToTablaclientes}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Clientes</span>
                  </li>

                  <li onClick={handleNavigateToTablaProductos}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Productos</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Inventario</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Productos adicionales</span>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* logica modales close 
      {showModalroll && (
        <FormRoll
          show={showModalroll}
          handleClose={handleCloseModalroll}
          roll={selectedRoll} // Pasa el rol seleccionado o null
          isEditing={isEditingRoll} // Pasa si estamos editando o creando
        />
      )}*/}

      {/*  {showModalEquipo && (
        <FormEquipo
          show={showModalEquipo}
          handleClose={handleCloseModalequipo}
          equipo={selectedequipo} // Pasa el rol seleccionado o null
          isEditing={isEditingequipo} // Pasa si estamos editando o creando
        />
      )} */}

      {/* {showModalRed && (
        <FormRed
          show={showModalRed}
          handleClose={handleCloseModalRed}
          roll={selectedRed} // Pasa el rol seleccionado o null
          isEditing={isEditingRed} // Pasa si estamos editando o creando
        />
      )} */}

      {/*   {showModalZona && (
        <FormZona
          show={showModalZona}
          handleClose={handleCloseModalZona}
          selectedZone={selectedZona} // Pasa el rol seleccionado o null
          isEditing={isEditingZona} // Pasa si estamos editando o creando
        />
      )} */}

      {/*  {showModalCiudad && (
        <FormCiudad
          show={showModalCiudad}
          handleClose={handleCloseModalCiudad}
          ciudad={selectedCiudad} // Pasa el rol seleccionado o null
          isEditing={isEditingCiudad} // Pasa si estamos editando o creando
        />
      )} */}

      {showModalClientes && (
        <FormClientes
          show={showModalClientes}
          handleClose={handleCloseModalClientes}
        />
      )}

      {showModalInventario && (
        <FormInventario
          show={showModalInventario}
          handleClose={handleCloseModalInventario}
        />
      )}
    </>
  );
};

export default SlideMenu;
