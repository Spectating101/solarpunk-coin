// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
    function decimals() external view returns (uint8);
}

interface ISolarPunkCoin {
    function updateOraclePriceAndAdjust(uint256 newPrice) external returns (bool);
    function updateEnergyPrice(uint256 newPrice) external;
}

interface ISolarPunkOption {
    function updateIndex(uint256 newIndex, bytes32 sourceHash) external;
}

/**
 * @title ChainlinkOracleAdapter
 * @notice Reads from Chainlink price feeds and pushes values into SolarPunk contracts.
 *
 * Deployment pattern:
 *   1. Deploy this adapter
 *   2. Grant ORACLE_ROLE in SolarPunkCoin to this adapter's address
 *   3. Grant ORACLE_ROLE in SolarPunkOption to this adapter's address
 *   4. Call pushSpkPrice() / pushEnergyPrice() / pushOptionIndex() on a schedule
 *      (off-chain keeper or Chainlink Automation)
 *
 * Chainlink feed addresses (Sepolia):
 *   ETH/USD:  0x694AA1769357215DE4FAC081bf1f309aDC325306
 *   BTC/USD:  0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
 *
 * For energy price: no Chainlink energy feed exists on Sepolia.
 * Set a manual fallback via setManualEnergyPrice() until a real feed is available.
 *
 * @dev Staleness protection: rejects feed answers older than maxStaleness seconds.
 */
contract ChainlinkOracleAdapter is Ownable {
    // ── State ──────────────────────────────────────────────────────────────

    /// @notice Chainlink feed used as the SPK market price proxy (e.g. ETH/USD or a custom feed)
    AggregatorV3Interface public spkPriceFeed;

    /// @notice Chainlink feed used as the energy index for options (e.g. energy commodity feed)
    AggregatorV3Interface public energyIndexFeed;

    /// @notice Manual energy price fallback (USD per kWh, 1e18 precision) used when no feed is set
    uint256 public manualEnergyPricePerKwh;

    /// @notice Maximum age of a Chainlink answer before it is considered stale (seconds)
    uint256 public maxStaleness = 3600; // 1 hour default

    /// @notice SolarPunkCoin contract to push prices into
    ISolarPunkCoin public spkCoin;

    /// @notice SolarPunkOption contract to push index into
    ISolarPunkOption public spkOption;

    // ── Events ─────────────────────────────────────────────────────────────

    event SpkPricePushed(uint256 price, address feed, uint256 timestamp);
    event EnergyPricePushed(uint256 pricePerKwh, bool fromFeed, uint256 timestamp);
    event OptionIndexPushed(uint256 index, address feed, bytes32 sourceHash, uint256 timestamp);
    event SpkPriceFeedUpdated(address feed);
    event EnergyIndexFeedUpdated(address feed);
    event ManualEnergyPriceSet(uint256 pricePerKwh);
    event MaxStalenessUpdated(uint256 seconds_);
    event TargetContractsUpdated(address spkCoin, address spkOption);

    // ── Constructor ────────────────────────────────────────────────────────

    constructor(address spkCoin_, address spkOption_) Ownable(msg.sender) {
        require(spkCoin_ != address(0), "invalid spkCoin");
        spkCoin = ISolarPunkCoin(spkCoin_);
        if (spkOption_ != address(0)) {
            spkOption = ISolarPunkOption(spkOption_);
        }
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    function setSpkPriceFeed(address feed) external onlyOwner {
        require(feed != address(0), "invalid feed");
        spkPriceFeed = AggregatorV3Interface(feed);
        emit SpkPriceFeedUpdated(feed);
    }

    function setEnergyIndexFeed(address feed) external onlyOwner {
        require(feed != address(0), "invalid feed");
        energyIndexFeed = AggregatorV3Interface(feed);
        emit EnergyIndexFeedUpdated(feed);
    }

    /// @notice Set manual energy price when no on-chain feed exists for energy
    /// @param pricePerKwh USD per kWh in 1e18 precision (e.g. 5e16 = $0.05/kWh)
    function setManualEnergyPrice(uint256 pricePerKwh) external onlyOwner {
        require(pricePerKwh > 0, "price must be positive");
        manualEnergyPricePerKwh = pricePerKwh;
        emit ManualEnergyPriceSet(pricePerKwh);
    }

    function setMaxStaleness(uint256 seconds_) external onlyOwner {
        require(seconds_ >= 60, "staleness too low");
        maxStaleness = seconds_;
        emit MaxStalenessUpdated(seconds_);
    }

    function setTargetContracts(address spkCoin_, address spkOption_) external onlyOwner {
        require(spkCoin_ != address(0), "invalid spkCoin");
        spkCoin = ISolarPunkCoin(spkCoin_);
        spkOption = ISolarPunkOption(spkOption_);
        emit TargetContractsUpdated(spkCoin_, spkOption_);
    }

    // ── Push functions (callable by keeper or anyone) ──────────────────────

    /**
     * @notice Read SPK price from Chainlink feed and push to SolarPunkCoin
     * @dev SolarPunkCoin expects price in 1e18 precision (USD).
     *      Chainlink feeds use varying decimal counts — this normalises to 1e18.
     */
    function pushSpkPrice() external {
        require(address(spkPriceFeed) != address(0), "no SPK price feed set");
        (uint256 price, uint256 updatedAt) = _readFeed(spkPriceFeed);
        _checkStaleness(updatedAt);

        spkCoin.updateOraclePriceAndAdjust(price);
        emit SpkPricePushed(price, address(spkPriceFeed), block.timestamp);
    }

    /**
     * @notice Push energy price per kWh into SolarPunkCoin
     * @dev Uses energyIndexFeed if set, otherwise falls back to manualEnergyPricePerKwh.
     *      Energy price determines how many SPK are minted per kWh of surplus.
     */
    function pushEnergyPrice() external {
        uint256 price;
        bool fromFeed = address(energyIndexFeed) != address(0);

        if (fromFeed) {
            (uint256 feedPrice, uint256 updatedAt) = _readFeed(energyIndexFeed);
            _checkStaleness(updatedAt);
            price = feedPrice;
        } else {
            require(manualEnergyPricePerKwh > 0, "no energy price set");
            price = manualEnergyPricePerKwh;
        }

        spkCoin.updateEnergyPrice(price);
        emit EnergyPricePushed(price, fromFeed, block.timestamp);
    }

    /**
     * @notice Push energy index into SolarPunkOption for mark-to-market
     * @dev Uses energyIndexFeed. sourceHash encodes the feed address for auditability.
     */
    function pushOptionIndex() external {
        require(address(energyIndexFeed) != address(0), "no energy index feed set");
        require(address(spkOption) != address(0), "no option contract set");

        (uint256 index, uint256 updatedAt) = _readFeed(energyIndexFeed);
        _checkStaleness(updatedAt);

        bytes32 sourceHash = keccak256(abi.encode(address(energyIndexFeed), updatedAt));
        spkOption.updateIndex(index, sourceHash);
        emit OptionIndexPushed(index, address(energyIndexFeed), sourceHash, block.timestamp);
    }

    /**
     * @notice Push all available values in a single call (gas-efficient for keepers)
     */
    function pushAll() external {
        if (address(spkPriceFeed) != address(0)) {
            (uint256 price, uint256 updatedAt) = _readFeed(spkPriceFeed);
            if (block.timestamp - updatedAt <= maxStaleness) {
                spkCoin.updateOraclePriceAndAdjust(price);
                emit SpkPricePushed(price, address(spkPriceFeed), block.timestamp);
            }
        }

        bool hasEnergyFeed = address(energyIndexFeed) != address(0);
        uint256 energyPrice;
        if (hasEnergyFeed) {
            (uint256 fp, uint256 updatedAt) = _readFeed(energyIndexFeed);
            if (block.timestamp - updatedAt <= maxStaleness) {
                energyPrice = fp;
                spkCoin.updateEnergyPrice(fp);
                emit EnergyPricePushed(fp, true, block.timestamp);

                if (address(spkOption) != address(0)) {
                    bytes32 sourceHash = keccak256(abi.encode(address(energyIndexFeed), updatedAt));
                    spkOption.updateIndex(fp, sourceHash);
                    emit OptionIndexPushed(fp, address(energyIndexFeed), sourceHash, block.timestamp);
                }
            }
        } else if (manualEnergyPricePerKwh > 0) {
            spkCoin.updateEnergyPrice(manualEnergyPricePerKwh);
            emit EnergyPricePushed(manualEnergyPricePerKwh, false, block.timestamp);
        }
    }

    // ── View ───────────────────────────────────────────────────────────────

    /// @notice Read current SPK price from feed without pushing
    function readSpkPrice() external view returns (uint256 price, uint256 updatedAt) {
        require(address(spkPriceFeed) != address(0), "no feed");
        return _readFeed(spkPriceFeed);
    }

    /// @notice Read current energy index from feed without pushing
    function readEnergyIndex() external view returns (uint256 index, uint256 updatedAt) {
        require(address(energyIndexFeed) != address(0), "no feed");
        return _readFeed(energyIndexFeed);
    }

    // ── Internal ───────────────────────────────────────────────────────────

    /// @dev Read latest answer from a Chainlink feed and normalise to 1e18
    function _readFeed(AggregatorV3Interface feed)
        internal
        view
        returns (uint256 price18, uint256 updatedAt)
    {
        (, int256 answer, , uint256 _updatedAt, ) = feed.latestRoundData();
        require(answer > 0, "negative or zero price from feed");

        uint8 feedDecimals = feed.decimals();
        // Normalise: multiply by 10^(18 - feedDecimals) or divide by 10^(feedDecimals - 18)
        if (feedDecimals <= 18) {
            price18 = uint256(answer) * (10 ** (18 - feedDecimals));
        } else {
            price18 = uint256(answer) / (10 ** (feedDecimals - 18));
        }
        updatedAt = _updatedAt;
    }

    function _checkStaleness(uint256 updatedAt) internal view {
        require(block.timestamp - updatedAt <= maxStaleness, "Chainlink feed stale");
    }
}
