#!/usr/bin/python3

from brownie import *
from scripts.utils.helpers import *
import json


def main():

    deployer = get_deployer()

    with open('contrat_addresses.json', "r") as f:
        contract_addresses = json.load(f)

    stakingPoolAddress = contract_addresses["stakingPool_addr"]

    stakingPool = StakingPool.at(stakingPoolAddress)

    print("staking...")
    stakingPool.stake({'value': 32 * 10 ** 18, 'from': deployer})