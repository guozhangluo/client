import LotImportTable from "../../../../components/Table/lgTable/LotImportTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LotImportProperties  extends EntityScanProperties {

    static displayName = 'LotImportProperties';

    constructor(props) {
        super(props);
        this.state = {...this.state, ...{showQueryFormButton: false}};
    }

    resetData = () => {
        this.setState({
          tableData: [],
          loading: false,
          resetFlag: true
        });
    }

    buildTable = () => {
        return <LotImportTable 
                        pagination={true} 
                        propsFrom = {this.form}
                        rowKey={this.state.rowKey} 
                        ref={(showTable) => { this.showTable = showTable }} 
                        table={this.state.table} 
                        data={this.state.tableData} 
                        loading={this.state.loading} 
                        resetData={this.resetData.bind(this)}/>
    }
}