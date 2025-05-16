// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import {ICOFactory, ICOSale, SimpleMintableERC20} from "src/Contract.sol";

contract ICOFactoryTest is Test {
    ICOFactory factory;
    address founder      = address(0xABCD);
    address contributor  = address(0xBEEF);

    function setUp() public {
        vm.prank(founder);
        factory = new ICOFactory();
        vm.deal(contributor, 100 ether);
    }

    // ──────────────────────────────────────────────────────────────
    // 1. sale + token deployment
    // ──────────────────────────────────────────────────────────────
    function testCreateSaleWithNewToken() public {
        vm.prank(founder);
        (address sale, address token) = factory.createSaleWithNewToken(
            "TestToken",
            "TTK",
            address(0),                       // pay in native ETH/GHO
            uint40(block.timestamp),
            uint40(block.timestamp + 1 days),
            1 ether,                          // 1 ETH per 1e18 tokens
            1 ether,
            10 ether,
            "Test token sale"
        );

        assertTrue(sale  != address(0), "sale addr-zero");
        assertTrue(sale  != address(0), "token addr-zero");
        assertEq(factory.saleToToken(sale), token);
    }

    // ──────────────────────────────────────────────────────────────
    // 2. contribute with native ETH
    // ──────────────────────────────────────────────────────────────
    function testContributeNativeETH() public {
        vm.prank(founder);
        (address sale, address token) = factory.createSaleWithNewToken(
            "TestToken",
            "TTK",
            address(0),
            uint40(block.timestamp),
            uint40(block.timestamp + 1 days),
            1 ether,
            1 ether,
            10 ether,
            "This is a description"
        );

        vm.deal(contributor, 10 ether);

        vm.prank(contributor);
        (bool sent, ) = sale.call{value: 2 ether}(abi.encodeWithSignature("contribute(uint256)", 2 ether));
        require(sent, "contribute() reverted");

        uint256 bal = SimpleMintableERC20(token).balanceOf(contributor);
        assertEq(bal, 2 ether, "mint mismatch");
    }

    // ──────────────────────────────────────────────────────────────
    // 3. hard‑cap: excess ETH is refunded automatically
    // ──────────────────────────────────────────────────────────────
    function testExceedHardCapRefundsExcess() public {
        vm.prank(founder);
        (address sale, ) = factory.createSaleWithNewToken(
            "Test",
            "TT",
            address(0),
            uint40(block.timestamp),
            uint40(block.timestamp + 1 days),
            1 ether,
            1 ether,
            3 ether,                               // hard cap = 3 ETH
            "Exceed cap refund test"
        );

        vm.deal(contributor, 10 ether);
        vm.prank(contributor);
        (bool ok, ) = sale.call{value: 5 ether}(abi.encodeWithSignature("contribute(uint256)", 5 ether));
        require(ok, "contribute() revert");

        uint256 raised = ICOSale(payable(sale)).totalRaised();
        assertEq(raised, 3 ether, "should clip to hardCap");
    }

    // ──────────────────────────────────────────────────────────────
    // 4. finalize succeeds (softCap reached)
    // ──────────────────────────────────────────────────────────────
    function testFinalizeSuccess() public {
        vm.prank(founder);
        (address sale, ) = factory.createSaleWithNewToken(
            "Test",
            "TT",
            address(0),
            uint40(block.timestamp),
            uint40(block.timestamp + 1),          // ends in 1 sec
            1 ether,
            1 ether,
            5 ether,
            "Exceed cap refund test"
        );

        vm.prank(contributor);
        (bool ok, ) = sale.call{value: 2 ether}(abi.encodeWithSignature("contribute(uint256)", 2 ether));
        require(ok);

        skip(2);                                  // warp past end
        vm.prank(founder);
        ICOSale(payable(sale)).finalize();

        assertTrue(ICOSale(payable(sale)).finalized(), "not finalized");
    }

    // ──────────────────────────────────────────────────────────────
    // 5. finalize fails → refunds path
    // ──────────────────────────────────────────────────────────────
    function testFinalizeFailAndRefund() public {
        vm.prank(founder);
        (address sale, ) = factory.createSaleWithNewToken(
            "Test",
            "TT",
            address(0),
            uint40(block.timestamp),
            uint40(block.timestamp + 1),
            1 ether,
            5 ether,                              // softCap 5
            10 ether,
            "deploy"
        );

        vm.prank(contributor);
        (bool ok, ) = sale.call{value: 2 ether}(abi.encodeWithSignature("contribute(uint256)", 2 ether));
        require(ok);

        skip(2);
        vm.prank(founder);
        ICOSale(payable(sale)).finalize();

        assertTrue(ICOSale(payable(sale)).refundsOpen(), "refunds closed");

        uint256 before = contributor.balance;
        vm.prank(contributor);
        ICOSale(payable(sale)).refund();
        uint256 afterRefund = contributor.balance;
        assertGt(afterRefund, before, "refund didn't increase balance");


    }
}
