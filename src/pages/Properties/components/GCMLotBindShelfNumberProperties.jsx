import EntityScanProperties from "./entityProperties/EntityScanProperties";
import GCMLotBindShelfNumberTable from "../../../components/Table/gc/GCMLotBindShelfNumberTable";

export default class GCMLotBindShelfNumberProperties  extends EntityScanProperties {

    static displayName = 'GCMLotBindShelfNumberProperties';

    resetData = () => {
        this.setState({
          tableData: [],
          loading: false,
          resetFlag: true,
        });
    }

    buildTable = () => {
        return <GCMLotBindShelfNumberTable    
                                      pagination={true} 
                                      rowKey={this.state.rowKey} 
                                      table={this.state.table} 
                                      data={this.state.tableData} 
                                      loading={this.state.loading} 
                                      resetData={this.resetData.bind(this)}/>
    }
}