enum ICOStatus {
  Active = 0,
  Paused = 1,
  Successful = 2,
  Failed = 3,
}

// export interface OffChainICO {
//   id: string; // mirrors OnChainICO.id
//   symbol: string;
//   slug: string; // URL‑friendly
//   description: string;
//   imageURI?: string;
//   name: string;

//   /* Team & trust signals */
//   team: { name: string; role: string; wallet: string }[];

//   /* Reputation & community feedback */
//   reputationScore: number; // 0‑100
//   upvotes: number;
//   downvotes: number;
//   commentsCount: number;

//   /* Timestamps for indexing/UI */
//   createdAt: string; // ISO‑8601
//   updatedAt: string;
//   tokenAddress: string; // ERC‑20/721 being sold
//   startTime: bigint; // unix seconds
//   endTime: bigint;
//   fundsRaised: bigint; // updates in‑contract
//   status: ICOStatus; // enum (Draft | Active | Paused | Successful | Failed | Refunded)
// }

type IcoCardProps = {
  sale: `0x${string}`;
  name: string;
  symbol: string;
  imageURI: string;
  totalRaised: bigint;
  end: number;
  description?: string;
  reputationScore?: number;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
};


// export const dummyICOs: OffChainICO[] = [
//   {
//     id: 'ico-001',
//     title: 'GreenChain Token Sale',
//     slug: 'greenchain-token-sale',
//     description: 'GreenChain is building a decentralized platform for sustainable energy trading.',
//     logoUrl: 'https://picsum.photos/300/250',
//     team: [
//       { name: 'Alice Johnson', role: 'CEO', wallet: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst' },
//       { name: 'Bob Smith', role: 'CTO', wallet: '0x2345bcde6789fgha0123jklm4567nopq8901rstu' },
//     ],
//     reputationScore: 87,
//     upvotes: 121212121,
//     downvotes: 8,
//     commentsCount: 34,
//     createdAt: '2025-04-01T10:00:00Z',
//     updatedAt: '2025-05-09T15:30:00Z',
//     tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
//     startTime: 1711958400n,
//     endTime: 1714550400n,
//     fundsRaised: 2500000000000000000000n,
//     status: ICOStatus.Successful,
//   },
//   {
//     id: 'ico-002',
//     title: 'Artify NFT Launch',
//     slug: 'artify-nft-launch',
//     description: 'Artify is a curated NFT marketplace for digital artists and collectors.',
//     logoUrl: 'https://picsum.photos/300/300',
//     team: [
//       { name: 'Carla Mendes', role: 'Founder', wallet: '0x3456cdef7890ghab1234klmn5678opqr9012stuv' },
//     ],
//     reputationScore: 72,
//     upvotes: 80,
//     downvotes: 1511,
//     commentsCount: 19,
//     createdAt: '2025-03-15T09:00:00Z',
//     updatedAt: '2025-05-08T12:00:00Z',
//     tokenAddress: '0xbcdefa2345678901bcdefa2345678901bcdefa23',
//     startTime: 1710633600n,
//     endTime: 1713225600n,
//     fundsRaised: 500000000000000000000n,
//     status: ICOStatus.Failed,
//   },
//   {
//     id: 'ico-003',
//     title: 'DeFiLend Protocol',
//     slug: 'defilend-protocol',
//     description: 'DeFiLend is a decentralized lending protocol for stablecoins.',
//     logoUrl: 'https://picsum.photos/200/300',
//     team: [
//       { name: 'David Kim', role: 'Lead Developer', wallet: '0x4567defa8901habc2345lmno6789pqrs0123tuvw' },
//       { name: 'Elena Petrova', role: 'Community Manager', wallet: '0x5678efab9012ibcd3456mnop7890qrst1234uvwx' },
//     ],
//     reputationScore: 95,
//     upvotes: 210,
//     downvotes: 3,
//     commentsCount: 58,
//     createdAt: '2025-05-01T08:00:00Z',
//     updatedAt: '2025-05-09T10:00:00Z',
//     tokenAddress: '0xcdefab3456789012cdefab3456789012cdefab34',
//     startTime: 1746480000n,
//     endTime: 1749072000n,
//     fundsRaised: 10000000000000000000000n,
//     status: ICOStatus.Active,
//   },
//   {
//     id: 'ico-004',
//     title: 'EduToken ICO',
//     slug: 'edutoken-ico',
//     description: 'EduToken is revolutionizing online education with blockchain-based credentials.',
//     logoUrl: 'https://picsum.photos/250/250',
//     team: [
//       { name: 'Fiona Lee', role: 'CEO', wallet: '0x6789fabc0123jklm4567nopq8901rstu2345vwxy' },
//       { name: 'George Brown', role: 'COO', wallet: '0x7890gabc1234klmn5678opqr9012stuv3456wxyz' },
//     ],
//     reputationScore: 60,
//     upvotes: 45,
//     downvotes: 20,
//     commentsCount: 12,
//     createdAt: '2025-02-10T11:00:00Z',
//     updatedAt: '2025-03-01T09:00:00Z',
//     tokenAddress: '0xdefabc4567890123defabc4567890123defabc45',
//     startTime: 1707523200n,
//     endTime: 1710115200n,
//     fundsRaised: 200000000000000000000n,
//     status: ICOStatus.Failed,
//   },
//   {
//     id: 'ico-005',
//     title: 'HealthChain',
//     slug: 'healthchain',
//     description: 'HealthChain is a decentralized health records management system.',
//     logoUrl: 'https://picsum.photos/400/400',
//     team: [
//       { name: 'Irene Adler', role: 'Founder', wallet: '0x8901habc2345lmno6789pqrs0123tuvw4567xyza' },
//     ],
//     reputationScore: 78,
//     upvotes: 100,
//     downvotes: 12,
//     commentsCount: 25,
//     createdAt: '2025-01-20T14:00:00Z',
//     updatedAt: '2025-02-15T16:00:00Z',
//     tokenAddress: '0xefabc5678901234efabc5678901234efabc56789',
//     startTime: 1705708800n,
//     endTime: 1708300800n,
//     fundsRaised: 750000000000000000000n,
//     status: ICOStatus.Successful,
//   },
//   {
//     id: 'ico-006',
//     title: 'TravelX',
//     slug: 'travelx',
//     description: 'TravelX is a blockchain-based travel booking platform.',
//     logoUrl: 'https://picsum.photos/400/300',
//     team: [
//       { name: 'Jack Turner', role: 'CEO', wallet: '0x9012ibcd3456mnop7890qrst1234uvwx5678yzab' },
//       { name: 'Karen White', role: 'CTO', wallet: '0xa123jklm4567nopq8901rstu2345vwxy6789zabc' },
//     ],
//     reputationScore: 82,
//     upvotes: 130,
//     downvotes: 10,
//     commentsCount: 40,
//     createdAt: '2025-03-05T13:00:00Z',
//     updatedAt: '2025-04-01T10:00:00Z',
//     tokenAddress: '0xfabc6789012345fabc6789012345fabc67890123',
//     startTime: 1710028800n,
//     endTime: 1712620800n,
//     fundsRaised: 1800000000000000000000n,
//     status: ICOStatus.Successful,
//   },
//   {
//     id: 'ico-007',
//     title: 'GameFi Heroes',
//     slug: 'gamefi-heroes',
//     description: 'GameFi Heroes is a play-to-earn blockchain game with NFT characters.',
//     logoUrl: 'https://picsum.photos/300/400',
//     team: [
//       { name: 'Liam Chen', role: 'Game Director', wallet: '0xb234klmn5678opqr9012stuv3456wxyz7890abcd' },
//       { name: 'Mia Wong', role: 'Lead Artist', wallet: '0xc345lmno6789pqrs0123tuvw4567xyza8901bcde' },
//     ],
//     reputationScore: 90,
//     upvotes: 200,
//     downvotes: 5,
//     commentsCount: 60,
//     createdAt: '2025-04-10T15:00:00Z',
//     updatedAt: '2025-05-01T12:00:00Z',
//     tokenAddress: '0xabc6789012345abc6789012345abc67890123456',
//     startTime: 1712716800n,
//     endTime: 1715308800n,
//     fundsRaised: 5000000000000000000000n,
//     status: ICOStatus.Active,
//   },
//   {
//     id: 'ico-008',
//     title: 'SupplyNet',
//     slug: 'supplynet',
//     // description: 'SupplyNet is a decentralized supply chain tracking solution.',
//     description: '',
//     logoUrl: 'https://picsum.photos/450/400',
//     team: [
//       { name: 'Noah Patel', role: 'CEO', wallet: '0xd456mnop7890qrst1234uvwx5678yzab9012cdef' },
//     ],
//     reputationScore: 68,
//     upvotes: 60,
//     downvotes: 18,
//     commentsCount: 15,
//     createdAt: '2025-02-25T10:00:00Z',
//     updatedAt: '2025-03-10T11:00:00Z',
//     tokenAddress: '0xbc6789012345bc6789012345bc6789012345bc67',
//     startTime: 1709164800n,
//     endTime: 1711756800n,
//     fundsRaised: 300000000000000000000n,
//     status: ICOStatus.Failed,
//   },
//   {
//     id: 'ico-009',
//     title: 'MetaVerseX',
//     slug: 'metaversex',
//     description: 'MetaVerseX is building a virtual world with real economic incentives.',
//     logoUrl: 'https://picsum.photos/450/450',
//     team: [
//       { name: 'Olivia Green', role: 'CEO', wallet: '0xe567nopq8901rstu2345vwxy6789zabc1234defg' },
//       { name: 'Paul Black', role: 'Lead Developer', wallet: '0xf678opqr9012stuv3456wxyz7890abcd2345efgh' },
//     ],
//     reputationScore: 85,
//     upvotes: 170,
//     downvotes: 9,
//     commentsCount: 50,
//     createdAt: '2025-05-01T09:00:00Z',
//     updatedAt: '2025-05-09T11:00:00Z',
//     tokenAddress: '0xc6789012345c6789012345c6789012345c678901',
//     startTime: 1746480000n,
//     endTime: 1749072000n,
//     fundsRaised: 8000000000000000000000n,
//     status: ICOStatus.Active,
//   },
//   {
//     id: 'ico-010',
//     title: 'ThisIsAVeryLongName!!!!XDXDXDXDXDXDXDXDXDXDXDXD',
//     slug: 'charitychain',
//     description: 'CharityChain is a transparent donation platform powered by blockchain.',
//     // logoUrl: 'https://picsum.photos/450/550',
//     logoUrl: '',
//     team: [
//       { name: 'Quinn Lee', role: 'Founder', wallet: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst' },
//     ],
//     reputationScore: 92,
//     upvotes: 220,
//     downvotes: 4,
//     commentsCount: 70,
//     createdAt: '2025-04-20T08:00:00Z',
//     updatedAt: '2025-05-09T09:00:00Z',
//     tokenAddress: '0xdef9012345def9012345def9012345def9012345',
//     startTime: 1713571200n,
//     endTime: 1716163200n,
//     fundsRaised: 1200000000000000000000n,
//     status: ICOStatus.Active,
//   },
// ];
