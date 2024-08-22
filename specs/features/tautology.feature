Feature: Tautologies

  @canary
  Scenario: Logical Tautologies
    * truth is true
    * truth is not untrue

  @canary
  Scenario: Mathematical Tautologies
    * 1 plus 1 equals 2
    * the sum of 1 and 2 is 3

  @canary
  Scenario Outline: Summing Numbers
    Given two numbers <x> and <y>
    Then the sum is <sum>

    Examples:
      | x | y  | sum |
      | 1 |  2 |   3 |
      | 1 | -1 |   0 |
      | 0 |  0 |   0 |

  @canary
  Scenario: Verify multiple sums
    Given the following summation data
      | x | y  | sum |
      | 1 |  2 |   3 |
      | 1 | -1 |   0 |
      | 0 |  0 |   0 |
    Then all sums should be correct
