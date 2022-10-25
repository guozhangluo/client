import LotT7CodeConfigTable from "../../../../components/Table/lgTable/LotT7CodeConfigTable";
import EntityProperties from "../entityProperties/EntityProperties";

export default class LotT7CodeConfigProperties extends EntityProperties{

  static displayName = 'LotT7CodeConfigProperties';
    
  buildTable = () => {
      return <LotT7CodeConfigTable table={this.state.table}  data={this.state.tableData} loading={this.state.loading} />
  }

}