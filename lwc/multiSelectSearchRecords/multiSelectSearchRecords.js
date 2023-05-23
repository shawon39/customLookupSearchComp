import { LightningElement, api, track } from "lwc";

export default class MultiSelectSearchRecords extends LightningElement {
    @track recordList;
    @track allRecords;
    @track selectedItems = [];
    @track onLoad = true;

    listOfContactId;

    @api objectLabel;
    @api objectPluralName;

    @api
    get mappedContactList() {
        return this.recordList;
    }
    set mappedContactList(contacts) {
        this.allRecords = contacts;
        this.recordList = contacts;

        this.recordList = this.allRecords?.filter(
            (rec) => !this.selectedItems?.some((item) => item.id === rec.id)
        );

        if (this.recordList?.length && !this.onLoad) {
            this.showDropdown();
        } else {
            this.closeDropdown();
        }
    }

    handleFocus() {
        this.onLoad = false;
        this.showDropdown();
        if (!this.recordList.length) {
            this.closeDropdown();
        }
    }

    @track dropDownInFocus = false;
    handleBlur() {
        if (!this.dropDownInFocus) {
            this.closeDropdown();
        }
    }

    handleMouseleave() {
        this.dropDownInFocus = false;
    }

    handleMouseEnter() {
        this.dropDownInFocus = true;
    }

    handleLiClick(event) {
        let record = {
            id: event.currentTarget.dataset.id,
            name: event.currentTarget.dataset.name
        };

        if (!this.selectedItems?.some((item) => item.id === record.id)) {
            this.selectedItems.push(record);
            this.recordList = this.allRecords?.filter(
                (rec) => !this.selectedItems?.some((item) => item.id === rec.id)
            );
        }

        this.closeDropdown();
        this.getListOfContactId();
    }

    handleDeselect(event) {
        let id = event.currentTarget.dataset.id;
        this.selectedItems = this.selectedItems?.filter((item) => item.id !== id);
        this.recordList = this.allRecords?.filter(
            (rec) => !this.selectedItems?.some((item) => item.id === rec.id)
        );

        this.getListOfContactId();
    }

    handleOnChange(event) {
        this.fireAnEvent({
            eventName: "childdataevent",
            type: "search",
            data: event.target.value
        });
    }

    getListOfContactId() {
        this.listOfContactId = this.selectedItems.map((con) => con.id);
        this.fireAnEvent({
            eventName: "childdataevent",
            type: "getList",
            data: this.listOfContactId
        });
    }

    showDropdown() {
        const ddDiv = this.template.querySelector(".slds-combobox");
        ddDiv?.classList?.add("slds-is-open");
    }

    closeDropdown() {
        const ddDiv = this.template.querySelector(".slds-combobox");
        ddDiv?.classList?.remove("slds-is-open");
    }

    fireAnEvent(eventProps) {
        const customEvent = new CustomEvent(eventProps.eventName, {
            detail: {
                type: eventProps.type,
                data: eventProps.data
            }
        });
        this.dispatchEvent(customEvent);
    }
}