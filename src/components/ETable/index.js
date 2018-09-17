import React from 'react';
import Utils from '../../utils/utils';
import { Table } from 'antd';


export default class ETable extends React.Component {

    tableInit = () => {
        let row_selection = this.props.rowSelection;
        let selectedRowKeys = this.props.selectedRowKeys;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRowKeys,
        };

        //判断选项框类型
        if(row_selection === false || row_selection === null) {
            row_selection = false;
        } else if(row_selection == 'checkbox') {
            rowSelection.type = 'checkbox';
        } else {
            row_selection = true;
        }

        return <Table
                    bordered
                    {...this.props}
                    rowSelection={row_selection ? rowSelection : null}
                    onRow={(record, index)=> {
                        return {
                            onClick: ()=> {
                                if(!row_selection) {
                                    return;
                                }
                                this.onRowClick(record, index);
                            }
                        };
                    }}
                />
    };

    onRowClick = (recode, index) => {
        let rowSelection = this.props.rowSelection;
        if(rowSelection == 'checkbox') {
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedItem = this.props.selectedItem;
            let selectedIds = this.props.selectedIds;
            if(selectedIds) {
                const i = selectedIds.indexOf(recode.id);
                if(i == -1) {
                    selectedIds.push(recode.id);
                    selectedRowKeys.push(index);
                    selectedItem.push(recode);
                } else{
                    selectedIds.splice(i, 1);
                    selectedRowKeys.splice(i, 1);
                    selectedItem.splice(i, 1);
                }

            } else {
                selectedIds = [recode.id];
                selectedRowKeys = [index];
                selectedItem = [recode];
            }
            this.props.updateSelectedItem(selectedRowKeys, selectedItem, selectedIds);
        } else {
            let selectedRowKeys = [index];
            let selectedItem = recode;
            this.props.updateSelectedItem(selectedRowKeys, selectedItem)
        }
    };

    render() {
        return(
            <div>
                {this.tableInit()}
            </div>
        )
    }
}
