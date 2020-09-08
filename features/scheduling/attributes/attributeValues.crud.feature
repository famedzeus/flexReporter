Feature: Attribute Values CRUD
  As an admin user of Scheduling
  I should be able to create & read Attribute Features
  So that I can use them in Schedule Scope configuration

  Scenario: Navigation
    Given that I navigate to a url that should map to attribute values
    Then I should see the Assigned Attribute Features list

  Scenario: Feature Selection
    Given that I am on the attributes page
    Given that I have selected an attribute
      And that I have selected an attribute value
    When I select a feature that is not currently assigned
    Then The feature assignment button should be enabled

  Scenario: Feature Deselection
    Given that I am on the attributes page
    Given that I have selected an attribute
      And that I have selected an attribute value
    When I have not selected a feature
    Then The feature assignment button should be disabled

  Scenario: Assign a feature
    Given that I am on the attributes page
    Given that I have selected an attribute
      And that I have selected an attribute value
      And I select a feature that is not currently assigned
    When I click the assign feature button
    Then Then the feature should be assigned to the attribute value

  Scenario: Attempt to assign existing attribute feature
    Given that I am on the attributes page
    Given that I have selected an attribute
      And that I have selected an attribute value
    When I select a feature that is not already assigned
    Then The feature assignment button should be disabled