// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title Any‑Project ICO Framework with One‑Click Token Launch (Lens Chain / zkSync‑EVM) — No‑Clone Edition
 * @notice 2025‑05‑12
 *         Full‑bytecode deploys (no EIP‑1167 minimal proxies) so it works on zkSync‑Era / Lens.
 *         Contracts included in this file:
 *           1. SimpleMintableERC20 — template for project tokens
 *           2. ICOSale             — per‑project crowdsale logic
 *           3. ICOFactory          — deploys new token (optional) + new sale contract
 *
 * @dev Built against OpenZeppelin v5.
 */

// ---------------------------------------------------------------------------
//                            External dependencies
// ---------------------------------------------------------------------------

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {
    BASE_TOKEN_SYSTEM_CONTRACT
} from "@matterlabs/zksync-contracts/system-contracts/Constants.sol";
import {
    IBaseToken
} from "@matterlabs/zksync-contracts/system-contracts/interfaces/IBaseToken.sol";

// ---------------------------------------------------------------------------
//                –––––––––  1.  Token template  –––––––––
// ---------------------------------------------------------------------------

contract SimpleMintableERC20 is ERC20, ERC20Burnable, ERC20Permit, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bool private _initialized;

    string private _customName;
    string private _customSymbol;
    string public imageURI;

    constructor() ERC20("", "") ERC20Permit("") {}

    function initialize(string memory name_, string memory symbol_, address admin_) external {
        require(!_initialized, "init once");
        _initialized = true;

        _customName   = name_;
        _customSymbol = symbol_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
    }

    function setImageURI(string calldata uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(imageURI).length == 0, "Image already set");
        imageURI = uri;
    }


    // override metadata so it can be set post‑deployment
    function name() public view override returns (string memory) {
        return _customName;
    }

    function symbol() public view override returns (string memory) {
        return _customSymbol;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

// ---------------------------------------------------------------------------
//                –––––––––  2.  Individual sale contract  –––––––––
// ---------------------------------------------------------------------------

interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

contract ICOSale is ReentrancyGuard {
    // Errors ---------------------------------------------------------------
    error AlreadyInitialized();
    error NotOwner();
    error SaleNotActive();
    error SaleClosed();
    error HardCapReached();
    error RefundUnavailable();
    error NothingToRefund();

    // Storage --------------------------------------------------------------
    bool           public initialized;
    address        public owner;

    IERC20Mintable public saleToken;
    IERC20         public paymentToken; // address(0) => native gas token (ETH/GHO)

    uint40  public start;
    uint40  public end;
    uint256 public price;       // payment units for 1e18 tokens
    uint256 public softCap;
    uint256 public hardCap;
    string public description;

    uint256 public totalRaised;
    bool    public finalized;
    bool    public refundsOpen;

    mapping(address => uint256) public contributed;

    // Events ---------------------------------------------------------------
    event Contributed(address indexed buyer, uint256 paid, uint256 tokensOut);
    event Finalized(bool success, uint256 totalRaised);
    event Refunded(address indexed buyer, uint256 amount);
    event OwnerWithdrawn(uint256 amount);

    // Initializer ----------------------------------------------------------
    function initialize(
        address _owner,
        address _saleToken,
        address _paymentToken,
        uint40  _start,
        uint40  _end,
        uint256 _price,
        uint256 _softCap,
        uint256 _hardCap,
        string memory _description,
    ) external {
        if (initialized) revert AlreadyInitialized();
        initialized = true;

        owner        = _owner;
        saleToken    = IERC20Mintable(_saleToken);
        paymentToken = IERC20(_paymentToken);
        start        = _start;
        end          = _end;
        price        = _price;
        softCap      = _softCap;
        hardCap      = _hardCap;
        description  = _description;

        require(_owner != address(0) && _saleToken != address(0) && _price > 0, "bad args");
        require(_start < _end && _hardCap >= _softCap, "bad caps");
    }

    // Modifiers ------------------------------------------------------------
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }
    modifier saleActive() {
        if (block.timestamp < start || block.timestamp > end) revert SaleNotActive();
        _;
    }

    // Contribute -----------------------------------------------------------
    function contribute(uint256 amount) external payable nonReentrant saleActive {
        if (totalRaised >= hardCap) revert HardCapReached();

        uint256 paid;
        if (address(paymentToken) == address(0)) {
            paid = msg.value;
        } else {
            paymentToken.transferFrom(msg.sender, address(this), amount);
            paid = amount;
        }
        require(paid > 0, "paid 0");

        if (totalRaised + paid > hardCap) {
            uint256 excess = totalRaised + paid - hardCap;
            paid -= excess;
            _payout(msg.sender, excess);
        }

        contributed[msg.sender] += paid;
        totalRaised            += paid;

        uint256 tokensOut = (paid * 1e18) / price;
        saleToken.mint(msg.sender, tokensOut);
        emit Contributed(msg.sender, paid, tokensOut);
    }

    // Finalize -------------------------------------------------------------
    function finalize() external nonReentrant onlyOwner {
        if (block.timestamp <= end) revert SaleNotActive();
        if (finalized) revert SaleClosed();
        finalized = true;

        if (totalRaised >= softCap) {
            _payout(owner, totalRaised);
            emit OwnerWithdrawn(totalRaised);
            emit Finalized(true, totalRaised);
        } else {
            refundsOpen = true;
            emit Finalized(false, totalRaised);
        }
    }

    // Refund ---------------------------------------------------------------
    function refund() external nonReentrant {
        if (!refundsOpen) revert RefundUnavailable();
        uint256 amt = contributed[msg.sender];
        if (amt == 0) revert NothingToRefund();
        contributed[msg.sender] = 0;
        _payout(msg.sender, amt);
        emit Refunded(msg.sender, amt);
    }

    // Helpers --------------------------------------------------------------
    function _payout(address to, uint256 amt) internal {
        if (amt == 0) return;
        if (address(paymentToken) == address(0)) {
            (bool ok, ) = to.call{value: amt}("");
            require(ok, "transfer fail");
        } else {
            paymentToken.transfer(to, amt);
        }
    }

    receive() external payable {}
}

// ---------------------------------------------------------------------------
//                –––––––––  3.  Factory (token + sale)  –––––––––
// ---------------------------------------------------------------------------

contract ICOFactory is Ownable {
    address[] public allSales;
    mapping(address => address) public saleToToken; // sale => token

    event SaleCreated(address indexed sale, address indexed owner, address token, bool tokenJustDeployed);

    constructor() Ownable(msg.sender) {}

    // -------------------- Core create functions -------------------------

    /// @notice Founder already has a token; just create a sale.
    function createSale(
        address saleToken,
        address paymentToken,
        uint40  start,
        uint40  end,
        uint256 price,
        uint256 softCap,
        uint256 hardCap
    ) external returns (address sale) {
        sale = _deploySale(msg.sender, saleToken, paymentToken, start, end, price, softCap, hardCap);
        saleToToken[sale] = saleToken;
        emit SaleCreated(sale, msg.sender, saleToken, false);
    }

    /// @notice Deploys a fresh ERC‑20 and then a matching sale contract.
    function createSaleWithNewToken(
        string  calldata name,
        string  calldata symbol,
        address paymentToken,
        uint40  start,
        uint40  end,
        uint256 price,
        uint256 softCap,
        uint256 hardCap
    ) external returns (address sale, address token) {
        // 1. Deploy and init token
        token = address(new SimpleMintableERC20());
        SimpleMintableERC20(token).initialize(name, symbol, address(this));

        // 2. Deploy the crowdsale contract
        sale = _deploySale(msg.sender, token, paymentToken, start, end, price, softCap, hardCap);

        // 3. Wire roles so sale can mint & founder is admin
        bytes32 MINTER = SimpleMintableERC20(token).MINTER_ROLE();
        SimpleMintableERC20(token).grantRole(MINTER, sale);

        bytes32 ADMIN = SimpleMintableERC20(token).DEFAULT_ADMIN_ROLE();
        SimpleMintableERC20(token).grantRole(ADMIN, msg.sender);
        SimpleMintableERC20(token).renounceRole(ADMIN, address(this));

        saleToToken[sale] = token;
        emit SaleCreated(sale, msg.sender, token, true);
    }

    // -------------------- Internal helpers ------------------------------

    function _deploySale(
        address founder,
        address saleToken,
        address paymentToken,
        uint40  start,
        uint40  end,
        uint256 price,
        uint256 softCap,
        uint256 hardCap
    ) internal returns (address sale) {
        sale = address(new ICOSale());
        ICOSale(payable(sale)).initialize(founder, saleToken, paymentToken, start, end, price, softCap, hardCap);
        allSales.push(sale);
    }

    // View helpers ------------------------------------------------------
    function salesCount() external view returns (uint256) {
        return allSales.length;
    }
}
