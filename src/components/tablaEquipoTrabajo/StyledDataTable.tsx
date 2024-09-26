// StyledDataTable.tsx
import styled from "styled-components";
import DataTable from "react-data-table-component";

// Usamos `shouldForwardProp` para filtrar props desconocidos
const StyledDataTable = styled(DataTable).withConfig({
  shouldForwardProp: (prop) => !["allowOverflow"].includes(prop),
})``;

export default StyledDataTable;
