# SB Curated: A Curated Dataset of Vulnerable Solidity Smart Contracts
SB Curated is a dataset for research in automated reasoning and testing of smart contracts written in Solidity, the primary language used in Ethereum. It was developed as part of the [execution framework SmartBugs](https://github.com/smartbugs/smartbugs), which allows the possibility to integrate tools easily, so that they can be automatically compared (and their results reproduced). To the best of our knowledge, SmartBugs Curated is the largest dataset of its kind.


## Vulnerabilities

SmartBugs Curated provides a collection of vulnerable Solidity smart contracts organized according to the [DASP taxonomy](https://dasp.co):

| Vulnerability | Description | Level |
| --- | --- | -- |
| [Reentrancy](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/reentrancy) | Reentrant function calls make a contract to behave in an unexpected way | Solidity |
| [Access Control](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/access_control) | Failure to use function modifiers or use of tx.origin | Solidity |
| [Arithmetic](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/arithmetic) | Integer over/underflows | Solidity |
| [Unchecked Low Level Calls](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/unchecked_low_level_calls) | call(), callcode(), delegatecall() or send() fails and it is not checked | Solidity |
| [Denial Of Service](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/denial_of_service) | The contract is overwhelmed with time-consuming computations | Solidity |
| [Bad Randomness](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/bad_randomness) | Malicious miner biases the outcome | Blockchain |
| [Front Running](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/front_running) | Two dependent transactions that invoke the same contract are included in one block | Blockchain |
| [Time Manipulation](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/time_manipulation) | The timestamp of the block is manipulated by the miner | Blockchain |
| [Short Addresses](https://github.com/smartbugs/smartbugs-curated/tree/main/dataset/short_addresses) | EVM itself accepts incorrectly padded arguments | EVM |

## Example
Contracts are annotated with a comment containing information about their source (`@source`), author (`@author`), and line numbers of where vulnerabilities are reported (`@vulnerable_at_lines`). For each identified line, a comment with the type of the vulnerability is added (`// <yes> <report> CATEGORY`).
Here is the example of `time_manipulation/timed_crowdsale.sol`, which identifies a vulnerability of type `TIME_MANIPULATION` in line 19:

```
/*
 * @source: https://github.com/SmartContractSecurity/SWC-registry/blob/master/test_cases/timestamp_dependence/timed_crowdsale.sol
 * @author: -
 * @vulnerable_at_lines: 13
 */

pragma solidity ^0.4.25;

contract TimedCrowdsale {
  // Sale should finish exactly at January 1, 2019
  function isSaleFinished() view public returns (bool) {
    // <yes> <report> TIME_MANIPULATION
    return block.timestamp >= 1546300800;
  }
}
```

## Adding New Contracts
We welcome the community to add new contracts or update existing annotations. Please create a new pull request with the new information, following the annotation style described above. Moreover, please update the `vulnerabilities.json` file at the root of the repository. You can update this file by running the script `scripts/get_vulns_lines.js`. We suggest that you format the JSON file by running `python -m json.tool`.


## Work that uses SmartBugs Curated
- [A previous version of SmartBugs Curated was used to compare 9 analysis tools](https://joaoff.com/publication/2020/icse) (work published at ICSE 2020). The contracts used in this study are listed in the [file ICSE2020_curated_69.txt](https://github.com/smartbugs/smartbugs-curated/blob/main/ICSE2020_curated_69.txt). The results are available in a [separate repository](https://github.com/smartbugs/smartbugs-results).
- [SmartBugs Curated was used to evaluate a simple extension of Smartcheck](https://joaoff.com/publication/2020/ase) (work published at ASE 2020, _Tool Demo Track_)
- **... you are more than welcome to add your own work here!**

## License
All the contracts were obtained from public websites or using [Etherscan](http://etherscan.io) and they retain their original licenses. For all the other files, the [license detailed in the file LICENSE](LICENSE) applies.
