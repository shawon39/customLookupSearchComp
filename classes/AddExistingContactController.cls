public class AddExistingContactController {
    @AuraEnabled(cacheable=true)
    public static ResponseWrapper getAvailableContactList(String searchKey) {
        String bindSearchKey = '%' + searchKey + '%';

        List<Contact> contactList = [
            SELECT Name
            FROM Contact
            WHERE Opportunity__c = NULL AND IsPersonAccount = FALSE AND Name LIKE :bindSearchKey
            ORDER BY LastModifiedDate DESC
            LIMIT 50
        ];

        return new ResponseWrapper(true, contactList);
    }

    @AuraEnabled
    public static ResponseWrapper updateContactsWithOpportunity(String opportunityId, List<String> contactIds) {
        List<Contact> contacts = [SELECT Id, Opportunity__c FROM Contact WHERE Id IN :contactIds];

        List<Contact> updatedContacts = new List<Contact>();

        for (Contact contact : contacts) {
            contact.Opportunity__c = opportunityId;
            updatedContacts.add(contact);
        }

        try {
            if (!updatedContacts.isEmpty()) {
                update updatedContacts;
            }
            return new ResponseWrapper(true, 'Success');
        } catch (Exception e) {
            return new ResponseWrapper(false, e.getMessage());
        }
    }
}