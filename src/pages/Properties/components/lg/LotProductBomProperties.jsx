import LotProductBomTable from "../../../../components/Table/lgTable/LotProductBomTable";
import EntityProperties from "../entityProperties/EntityProperties";

export default class LotProductBomProperties extends EntityProperties{

  static displayName = 'LotProductBomProperties';
    
  buildTable = () => {
      return <LotProductBomTable table={this.state.table}  data={this.state.tableData} loading={this.state.loading} />
  }

}