@isTest
private class AddExistingContactControllerTest {
    @isTest
    static void testGetAvailableContactList() {
        // Create test data
        Contact contact1 = new Contact(lastName = 'John Doe');
        Contact contact2 = new Contact(lastName = 'Jane Smith');
        insert new List<Contact>{ contact1, contact2 };

        // Call the method under test
        Test.startTest();
        List<Contact> result = (List<Contact>) AddExistingContactController.getAvailableContactList('Doe').result;
        Test.stopTest();

        // Verify the results
        System.assertEquals(1, result.size(), 'Size should be 1');
        System.assertEquals(contact1.Id, result[0].Id, 'Id should be same');
    }

    @isTest
    static void testUpdateContactsWithOpportunity() {
        // Create test data
        Opportunity opportunity = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Closed Won',
            CloseDate = Date.today()
        );
        insert opportunity;

        Contact contact1 = new Contact(lastName = 'John Doe');
        Contact contact2 = new Contact(lastName = 'Jane Smith');
        insert new List<Contact>{ contact1, contact2 };

        // Call the method under test
        Test.startTest();
        AddExistingContactController.updateContactsWithOpportunity(opportunity.Id, new List<String>{ contact1.Id });
        Test.stopTest();

        // Verify the updated contact
        Contact updatedContact = [SELECT Id, Opportunity__c FROM Contact WHERE Id = :contact1.Id];
        System.assertEquals(opportunity.Id, updatedContact.Opportunity__c, 'Id should be same');
    }
}