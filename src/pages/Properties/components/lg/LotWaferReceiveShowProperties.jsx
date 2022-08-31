import EntityProperties from "../entityProperties/EntityProperties";
import LotWaferReceiveShowMLotUnitTable from "../../../../components/Table/lgTable/LotWaferReceiveShowMLotUnitTable";

export default class LotWaferReceiveShowProperties extends EntityProperties{

    static displayName = 'LotWaferReceiveShowProperties';

    componentWillReceiveProps = () => {
        this.queryData();
    }
    
    buildTable = () => {
        return <LotWaferReceiveShowMLotUnitTable 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    />
    }

}