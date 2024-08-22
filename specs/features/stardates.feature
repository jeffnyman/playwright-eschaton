Feature: Calculate Stardates

  Background:
    Given the stardate page

  Scenario Outline: Convert Valid TNG Era Stardates
    When the tng era <stardate> is converted
    Then the displayed and calculated calendar year should be <year>

    Examples:
      | stardate | year | comment      |
      |  46379.1 | 2369 | DS9 begins   |
      |  48315.6 | 2371 | VOY begins   |
      |  56844.9 | 2380 | TNG: Nemesis |
