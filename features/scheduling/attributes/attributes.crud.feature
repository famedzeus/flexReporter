Feature: Attributes CRUD
  As an admin user of Scheduling
  I should be able to create & read Attributes
  So that I can use them in Schedule Scope configuration

  Scenario: Navigation
    Given that I navigate to a url that should map to attributes
    Then I should see the Attributes list

  Scenario: Open create form
    Given that I am on the attributes page
    When I click the add button
    Then I should see the create attribute form

  Scenario: Create - fail to enter all required Fields
    Given that I am on the attributes page
    Given I click the add button
    Given I can see the create attribute form
    When I enter valid attribue name values
    Then I am not able to save

  Scenario: Create - enter all required fields but cancel
    Given that I am on the attributes page
    Given I click the add button
    Given I can see the create attribute form
    Given that I have entered all required fields
    When I click cancel button
    Then I can not see the record in the list

  Scenario: Create - enter all required fields and save
    Given that I am on the attributes page
    Given I click the add button
    Given I can see the create attribute form
    Given that I have entered all required fields
    When I click save resource button
    Then I can see the record in the list
