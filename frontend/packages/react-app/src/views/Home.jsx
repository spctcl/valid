import { useContractReader, useBalance } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers } from "ethers";
import { Transactor } from "../helpers";
import { useState } from "react";
import { Input, List, Divider, Card } from "antd";
import { Address, Balance, TokenBalance } from "../components";
import { getRPCPollTime } from "../helpers";
import externalContracts from "../contracts/external_contracts";
const { Search } = Input;

function Home({ localProvider, readContracts, writeContracts, userSigner, gasPrice, address, localChainId }) {
  const localProviderPollingTime = getRPCPollTime(localProvider);

  const [unStakeLoading, setUnStakeLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const validators = useContractReader(readContracts, "STAKINGPOOL", "getValidators");
  const sharePrice = useContractReader(readContracts, "SSVETHCONTRACT", "sharePrice");
  const beaconRewards = useContractReader(readContracts, "STAKINGPOOL", "beaconRewards");
  const executionRewards = useContractReader(readContracts, "STAKINGPOOL", "executionRewards");
  console.log("sharePrice", sharePrice?.toString());
  //const parsedSharePrice = Number(sharePrice / 10 ** 18).toFixed(18);
  const userEarnings = useContractReader(readContracts, "SSVETHCONTRACT", "balanceOf", [address]);
  console.log("userEarnings", userEarnings?.toString());
  const balanceStaked = useContractReader(readContracts, "STAKINGPOOL", "getUserStake", [address]);
  const stakingPoolAddress =
    localChainId === 31337
      ? externalContracts[31337].contracts.STAKINGPOOL.address
      : externalContracts[5].contracts.STAKINGPOOL.address;
  const stakingPoolBalance = useBalance(localProvider, stakingPoolAddress, localProviderPollingTime);
  const ssvEthAllowance = useContractReader(readContracts, "SSVETHCONTRACT", "allowance", [
    address,
    stakingPoolAddress,
  ]);
  const totalSupply = useContractReader(readContracts, "SSVETHCONTRACT", "totalSupply");
  // ** 📟 Listen for broadcast events
  const stakeEvents = useEventListener(readContracts, "STAKINGPOOL", "UserStaked", localProvider, 5);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  const handleOnStake = async value => {
    setStakeLoading(true);
    await tx(writeContracts.STAKINGPOOL.stake({ value: ethers.utils.parseEther(value) }));
    setStakeLoading(false);
  };

  const handleOnUnstake = async value => {
    if (ethers.utils.parseEther(value) > balanceStaked) {
      alert("You can't unstake more than you have !");
      return;
    } else {
      setUnStakeLoading(true);
      if (Number(ssvEthAllowance) > 0) {
        await tx(writeContracts.STAKINGPOOL.unStake(ethers.utils.parseEther(value)));
      } else {
        //approving max before calling the unstake method
        await tx(
          writeContracts.SSVETHCONTRACT.approve(stakingPoolAddress, "10000000000000000000000000000000000000000"),
        );
        tx(writeContracts.STAKINGPOOL.unStake(ethers.utils.parseEther(value)));
      }
    }
    setUnStakeLoading(false);
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #cccccc",
          width: 600,
          margin: "auto",
          justifyContent: "center",
          marginTop: 32,
          padding: 32,
        }}
      >
        <h2>Your Stake:</h2>
        <div
          style={{
            display: "flex",
            margin: "auto",
            justifyContent: "center",
          }}
        >
          <div style={{ padding: 8 }}>
            <h4>Your ETH staked: </h4>
            <TokenBalance balance={Number(balanceStaked)} fontSize={64} />
          </div>

          <div style={{ padding: 8 }}>
            <h4>Your valETH:</h4>
            <TokenBalance balance={Number(balanceStaked * (sharePrice / 10 ** 18))} fontSize={64} />
          </div>

          <div style={{ padding: 8 }}>
            <h4>ETH/valETH ratio:</h4>
            <TokenBalance balance={sharePrice} fontSize={64} />
          </div>
        </div>
        <div style={{ margin: 16 }}>
          <Search
            style={{ margin: "auto", width: "80%" }}
            placeholder="input unstake amount"
            enterButton="Unstake 🦴"
            size="medium"
            loading={unStakeLoading}
            onSearch={value => handleOnUnstake(value)}
          />
        </div>
        <div style={{ margin: 16 }}>
          <Search
            style={{ margin: "auto", width: "80%" }}
            placeholder="input stake amount"
            enterButton="Stake 🥩"
            size="medium"
            loading={stakeLoading}
            onSearch={value => handleOnStake(value)}
          />
        </div>
      </div>

      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 32 }}>
        <h2>Pool overview:</h2>
        <h4>
          Stake your ETH in the staking pool to earn our liquid staked derivative token called valETH, which you can
          also use in other DeFi protocols{" "}
        </h4>
        You can find more details{" "}
        <a href="https://github.com/bloxapp/awesome-ssv/blob/main/README.md" target="_blank" rel="noopener noreferrer">
          📕 here
        </a>
        <Divider />
        <div>
          <h4>valETH Total Supply: </h4>
          <TokenBalance balance={Number(totalSupply)} fontSize={64} />
        </div>
        <Divider />
        <Card>
          <h3 style={{ paddingTop: 16 }}>ETH under management:</h3>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h4 style={{ padding: 8 }}>Active validators:</h4>
              {validators !== undefined ? (
                <div style={{ fontSize: 20 }}>{validators?.length}</div>
              ) : (
                <div style={{ fontSize: 20 }}>0</div>
              )}
            </div>
            <div>
              <h4 style={{ padding: 8 }}>Active stake:</h4>
              <TokenBalance balance={Number(stakingPoolBalance)} fontSize={64} />{" "}
              <span style={{ fontSize: 20, verticalAlign: "middle" }}>ETH</span>
            </div>
            <div>
              <h4 style={{ padding: 8 }}>Rewards:</h4>
              Execution layer rewards :{" "}
              <div style={{ padding: 8, fontSize: 20 }}>
                {" "}
                <TokenBalance balance={Number(beaconRewards)} fontSize={64} />{" "}
                <span style={{ fontSize: 20, verticalAlign: "middle" }}>ETH</span>
              </div>
              Beacon chain rewards :
              <div style={{ padding: 8, fontSize: 20 }}>
                <TokenBalance balance={executionRewards} fontSize={64} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 32 }}>
        <h2 style={{ paddingTop: 16 }}>Stake Events:</h2>
        <List
          dataSource={stakeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber}>
                <Address value={item.args[0]} fontSize={16} /> =>
                <Balance balance={item.args[1]} />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}

export default Home;
