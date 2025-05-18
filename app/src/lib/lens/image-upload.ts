import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { immutable } from "@lens-chain/storage-client";

/**
 * Uploads an image file to Lens Grove storage.
 * @param file The image file to upload (must be <= 7MB).
 * @returns The Lens URI and gateway URL.
 * @throws Error if upload fails or file is too large.
 */
const storageClient = StorageClient.create();

export async function uploadImageToLens(file: File): Promise<{ uri: string; gatewayUrl: string; storageKey: string }> {
  if (file.size > 7 * 1024 * 1024) {
    throw new Error("Image must be less than 7MB");
  }

  const acl = immutable(chains.testnet.id); // Use the correct chain for your environment

  const response = await storageClient.uploadFile(file, { acl });

  return {
    uri: response.uri,
    gatewayUrl: response.gatewayUrl,
    storageKey: response.storageKey,
  };
}