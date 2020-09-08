Feature: Penalty function CRUD
  As an admin user of Scheduling
  I should be able to create, read, update & delete Penalty Functions
  So that I can use them in Schedule Scope configuration

  Scenario: Navigation
    Given that I navigate to a url that should map to penalty functions
    Then I should see the Penalty Functions list

  Scenario: Open create form
    Given that I am on the penalty functions page
    When I click the add button
    Then I should see the create penalty function form

  Scenario: Create - fail to enter all required Fields
    Given that I am on the penalty functions page
    Given I click the add button
    Given I can see the create penalty function form
    When I enter valid penalty name & cost function param values
    Then I am not able to save

  Scenario: Create - enter all required fields but cancel
    Given that I am on the penalty functions page
    Given I click the add button
    Given I can see the create penalty function form
    Given that I have entered all required fields
    When I click cancel button
    Then it should not persist changes

  Scenario: Create - enter all required fields and save
    Given that I am on the penalty functions page
    Given I click the add button
    Given I can see the create penalty function form
    Given that I have entered all required fields
    When I click save resource button
    Then it should create the new resource

  Scenario: Update - field entry
    Given that I am on the penalty functions page
    Given that the resource exists
    When I click the edit button for the resource
    Then I should see the penalty function edit form
    Then all primary key fields should be disabled

  Scenario: Update - commit changes
    Given that I am on the penalty functions page
    Given that the resource exists
    Given I click the edit button for the resource
    Given I should see the penalty function edit form
    Given that I have edited the resource
    When I click save resource button
    Then it should save the resource

  Scenario: Delete - confirmation
    Given that I am on the penalty functions page
    Given that the resource exists
    When I click the delete button for the resource
    Then I can see the confirmation dialog

  Scenario: Delete and cancel
    Given that I am on the penalty functions page
    Given that the resource exists
    Given that I have clicked the delete button for the resource
    Given I can see the confirmation dialog
    When I click the cancel delete button
    Then The delete operation should not be invoked

  Scenario: Delete and confirm
    Given that I am on the penalty functions page
    Given that the resource exists
    Given that I have clicked the delete button for the resource
    Given I can see the confirmation dialog
    When I click the confirm delete button
    Then The resource should no longer exist