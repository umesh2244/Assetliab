import { LightningElement, wire,track } from 'lwc';
import getAssetsList from '@salesforce/apex/AssetsLiabController.getAssetsList';
import getAssetsListt from '@salesforce/apex/AssetsLiabController.getAssetsListt';
import delSelectedAssets from '@salesforce/apex/AssetsLiabController.deleteAssets';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Asset', fieldName: 'Name', type: 'text' },
    //{ label: 'Account', fieldName: 'AccountId' },
    { label: 'Type', fieldName: 'NameOfNameSpace__Type__c', type: 'text' },
    { label: 'Balance', fieldName: 'NameOfNameSpace__Balance__c', type: 'number' },
   { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } }

];

export default class AssetLiability extends LightningElement {
    @track data = [];
    error;
    columns = columns;
    selectedRecords = [];
    refreshTable;
    netWorthTotal=0;
    assetsTotal=0;
    liabilitiesTotal=0;
    @track assetsData=[];
   /* @wire(getAssetsList)
    assets;*/
    // retrieving the data using wire service
    @wire(getAssetsListt)
   // @wire(getAssetsList)
    assetts(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            /*for(var i=0;i<result.data.length;i++){
                this.data = result.data[i].asset;
                console.log(result.data);
                console.log(result.data[i].asset);
                this.assetsData.push(result.data[i].asset);
                this.netWorth= this.netWorth+result.data[i].netWorth;
                this.assetsTotal= this.assetsTotal+result.data[i].assetsTotal;
                this.liabilitiesTotal= this.liabilitiesTotal+result.data[i].liabilitiesTotal;
            }
            console.log(this.netWorth);*/
            console.log(this.data);
            //this.data = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
 
    @wire(getAssetsList)
    assets(result) {
        this.refreshTable = result;
        if (result.data) {
           this.assetsData = result.data;
            /*for(var i=0;i<result.data.length;i++){
               // this.data = result.data[i].asset;
                console.log(result.data[i].asset);
                this.assetsData=result.data[i];
               /* this.netWorth= this.netWorth+result.data[i].netWorth;
                this.assetsTotal= this.assetsTotal+result.data[i].assetsTotal;
                this.liabilitiesTotal= this.liabilitiesTotal+result.data[i].liabilitiesTotal;
            }
            console.log(this.netWorth);*/
            for(var i=0;i<result.data.length;i++){
                if(result.data[i].Type == 'Asset'){
                    this.assetsTotal = this.assetsTotal+result.data[i].Balance;
                }else if(result.data[i].Type == 'Liability'){
                    this.liabilitiesTotal = this.liabilitiesTotal+result.data[i].Balance;
                }
            }
            this.netWorthTotal = this.assetsTotal+this.liabilitiesTotal;
            console.log(this.netWorthTotal);
            console.log(this.assetsData);
            //this.data = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    // refreshing the datatable after record edit form success
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }

    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            alert("You selected: " + selectedRows[i].Name);
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        console.log('inside handleRowAction- ');
        switch (action.name) {
            case 'show_details':
                alert('Showing Details: ' + JSON.stringify(row));
                break;
            case 'delete':
                this.deleteSelectedAssets(row);
                break;
     }
    }

    deleteSelectedAssets(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        this.showLoadingSpinner = true;

        // calling apex class method to delete the selected contact
        delSelectedAssets({lstAssetIds: currentRecord})
        .then(result => {
            window.console.log('result ====> ' + result);
            this.showLoadingSpinner = false;

            // showing success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: currentRow.Name +' Contact deleted.',
                variant: 'success'
            }),);

            // refreshing table data using refresh apex
            return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }),);
        });
    }
}