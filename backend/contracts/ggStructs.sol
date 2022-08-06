// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ggStructs {

    /* ggQuests */

    enum RewardType { ERC20, ERC721, ERC1155 }

    struct Quest {
        uint gameID;
        string metadataURL;
        uint reputationReward;
        Reward[] additionalRewards;
        bool isActive;
        bool exists;
    }

    struct UpdatableQuestFields {
        uint gameID;
        string metadataURL;
        uint reputationReward;
        Reward[] additionalRewards;
    }

    struct Reward {
        RewardType rewardType;
        address rewardContract; // The ERC20 contract for example
        uint amount;
        uint id; // optional (if ERC721 for example)
    }

    struct GameStudio {
        string name;
        string metadataURL;
        bool exists;
    }

    struct Game {
        GameStudio gameEditor;
        string gameName;
        string metadataURL;
        bool exists;
    }

    /* ggProfiles */

    struct ProfileData {
        // Data of the user
        string pseudo;
        string profilePictureURL;
        string coverPictureURL;
        bool isRegistered;

        // Reputation
        uint gainedReputation;
        uint lostReputation;

        // Associated hird parties (discord, twitch...)
        ThirdParty[] linkedThirdParties;
    }

    struct UpdatableByUserData {
        // Struct to facilitate ProfileData modifications by users
        string pseudo;
        string profilePictureURL;
        string coverPictureURL;
    }

    struct ThirdParty {
        uint thirdPartyId;
        uint userID;
    }
}