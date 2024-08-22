Feature: Weight on Planets

  Background:
    Given the planet weight page

  Scenario: Weight on Mercury
    When the weight calculated is 200
    Then the weight on Mercury will be exactly 75.6
    And the weight on Mercury will be roughly 75

  Scenario: Weight on Mercury (With Quoted)
    When the weight calculated is "200"
    Then the weight on Mercury will be exactly "75.6"

  Scenario: Weight on Mercury (Condensed)
    * a 200 pound person will weigh exactly 75.6 pounds on Mercury
    * a 200 pound person will weigh approximately 75 pounds on Mercury
