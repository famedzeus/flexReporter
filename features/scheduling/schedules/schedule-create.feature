Feature: Schedule creation
  As an Admin user
  I should be able to create new Schedule Scopes
  In order that schedule solutions can be calculated

  Scenario: Open the schedule creation dialog
    Given I am on the schedules page
    When I click the new schedule button
    Then I should see the schedule creation dialog

  Scenario Outline: Enter some valid field values
    Given I am on the schedules page
    Given I have clicked the new schedule button
    When I enter "scheduleScopeName" as "<scheduleScopeName>"
      And I enter "offlineEndShift" as "<offlineEndShift>"
      And I enter "offlineStartShift" as "<offlineStartShift>"
      And I enter "scheduleStartPeriod" as "<scheduleStartPeriod>"
      And I enter "scheduleEndPeriod" as "<scheduleEndPeriod>"
    Then I should see indication that the value is valid
    Then I can not apply the save button because required fields are missing

    Examples:
      | scheduleScopeName | scheduleStartPeriod | scheduleEndPeriod | offlineStartShift | offlineEndShift |
      | Test              | 20163201            | 20163202          | 2016-09-01::ds    | 2016-09-25::ds  |
      | Test 123          | 20163201            | 20163202          | 2016-09-01::ds    | 2016-09-25::ds  |

  Scenario Outline: Enter valid field values for all required fields
    Given I am on the schedules page
    Given I have clicked the new schedule button
    When I enter "scheduleScopeName" as "<scheduleScopeName>"
      And I enter "offlineEndShift" as "<offlineEndShift>"
      And I enter "offlineStartShift" as "<offlineStartShift>"
      And I enter "scheduleStartPeriod" as "<scheduleStartPeriod>"
      And I enter "scheduleEndPeriod" as "<scheduleEndPeriod>"
      And I enter "lineMapVersion" as "<lineMapVersion>"
    Then I should see indication that the value is valid
    Then I can apply the save button because all required fields are entered

    Examples:
      | scheduleScopeName | scheduleStartPeriod | scheduleEndPeriod | offlineStartShift | offlineEndShift | lineMapVersion |
      | Test              | 20163201            | 20163202          | 2016-09-01::ds    | 2016-09-25::ds  | dynamic-select |
      | Test 123          | 20163201            | 20163202          | 2016-09-01::ds    | 2016-09-25::ds  | dynamic-select |


  Scenario: Commit schedule entry
    Given I am on the schedules page
    Given I have clicked the new schedule button
    Given I haved entered all required fields
    When I click save
    Then I should see the new schedule listed in the schedules page

  Scenario: Open update schedule form
    Given I am on the schedules page
    When I click the edit schedule button
    Then I see the edit schedule form
    Then I see all fields populated with current model values
    Then I should not be able to edit primary fields

  Scenario: Cancel update schedule
    Given I am on the schedules page
    Given I click the edit schedule button
    Given I see the edit schedule form
    Given I see all fields populated with current model values
    Given I have edited a field
    When I click close button
    Then My changes will be lost

  Scenario: Cancel update schedule
    Given I am on the schedules page
    Given I click the edit schedule button
    Given I should see the edit schedule form
    Given I see all fields populated with current model values
    Given I have edited a field
    When I click save
    Then My changes will be persisted


  Scenario: Delete schedule entry
    Given I am on the schedules page
    Given A test generated schedule exists
    When I click delete schedule
    Then I should see a confirmation dialog to confirm my decision


  Scenario: Cancel delete schedule entry
    Given I am on the schedules page
    Given A test generated schedule exists
    Given I click delete schedule
    Given I can see the delete confirmation dialog
    When I click cancel
    Then I should see the new schedule listed in the schedules page


  Scenario: Confirm delete schedule entry
    Given I am on the schedules page
    Given A test generated schedule exists
    Given I click delete schedule
    Given I can see the delete confirmation dialog
    When I click confirm
    Then The schedule should be deleted and I should see it removed from the list
