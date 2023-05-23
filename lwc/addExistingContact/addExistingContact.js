import getAvailableContactList from "@salesforce/apex/AddExistingContactController.getAvailableContactList";
import updateContactsWithOpportunity from "@salesforce/apex/AddExistingContactController.updateContactsWithOpportunity";
import { LightningElement, api, track } from "lwc";

export default class AddExistingContact extends LightningElement {
    @api recordId;
    @track mappedContactList = [];
    @track listOfContactId = [];
    @track isLoading = false;

    connectedCallback() {
        this.getContactList("");
    }

    getContactList(searchKey) {
        getAvailableContactList({ searchKey: searchKey })
            .then((response) => {
                if (response.isSuccess) {
                    this.mappedContactList = this.mapContactRecords(response.result);
                } else {
                    this.handleError(response.errorMsg);
                }
            })
            .catch((error) => this.handleError(error.message));
    }

    mapContactRecords(records) {
        return records.map((record) => ({
            id: record.Id,
            name: record.Name
        }));
    }

    handleChildData(event) {
        if (event.detail.type === "getList") {
            this.listOfContactId = event.detail.data;
        } else if (event.detail.type === "search") {
            this.getContactList(event.detail.data);
        }
    }

    saveContact() {
        updateContactsWithOpportunity({ opportunityId: this.recordId, contactIds: this.listOfContactId })
            .then((response) => {
                if (response.isSuccess) {
                    this.handleSuccess();
                    this.navigateToRelatedContact();
                } else {
                    this.handleError(response.errorMsg);
                }
            })
            .catch((error) => this.handleError(error.message));
    }

    navigateToRelatedContact() {
        // Navigate to related contact list on Opportunity
        this.isLoading = true;
        let url = window.location.origin + "/lightning/r/Opportunity/" + this.recordId + "/related/Contacts__r/view";
        this.openWindowWithCallback(url, () => {
            this.isLoading = false;
        });
    }

    navigateToDetail() {
        // Navigate to Opportunity details page
        this.isLoading = true;
        let url = window.location.origin + "/lightning/r/Opportunity/" + this.recordId + "/view";
        this.openWindowWithCallback(url, () => {
            this.isLoading = false;
        });
    }

    openWindowWithCallback(url, callback) {
        const navigateUrl = window.open(url, "_self");
        if (navigateUrl) {
            url.addEventListener("load", () => {
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    }

    handleError(message) {
        console.log(message);
    }

    visible = false;
    handleSuccess() {
        this.visible = true;
        setTimeout(() => {
            this.visible = false;
        }, 3000);
    }

    get isDisabled() {
        return this.listOfContactId.length === 0;
    }
}