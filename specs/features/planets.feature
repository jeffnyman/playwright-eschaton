Feature: Weight on Planets

  Background:
    Given the planet weight page

  Scenario: Weight on Mercury
    When the weight calculated is 200
    Then the weight on Mercury will be exactly 75.6
    And the weight on Mercury will be roughly 75
