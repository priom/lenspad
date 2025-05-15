"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { AccountSelector } from "./accounts";

export function Login() {
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const { data: authenticatedUser, loading: authUserLoading } = useAuthenticatedUser();

  return (
    <div className="p-2 space-y-2 text-sm uppercase">
      <ConnectKitButton.Custom>
        {({ isConnected: isWalletConnected, show, truncatedAddress, ensName, chain }) => {
          const connectKitDisplayName = ensName ?? truncatedAddress;

          if (!isWalletConnected) {
            return (
                <Button type="button" onClick={show} className="bg-secondary border-0 px-6 md:py-6 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm">
                  CONNECT WALLET
                </Button>
            );
          }

          if (isWalletConnected && !authenticatedUser) {
            return (
              <AccountSelector
                open={showAccountSelector}
                onOpenChange={setShowAccountSelector}
                trigger={
                  <DialogTrigger asChild>
                    <Button className="w-full">Sign in with Lens</Button>
                  </DialogTrigger>
                }
              />
            );
          }

          if (isWalletConnected && authenticatedUser) {
            const displayIdentity = connectKitDisplayName ?? "...";
            return (
              <div className="flex items-center gap-2 text-sm w-full justify-between bg-secondary border-0 ">
                <span className="text-muted-foreground truncate" title={authenticatedUser.address}>
                  <span className="text-primary font-semibold font-mono">{displayIdentity}</span>
                </span>
              </div>
            );
          }

          return <p className="text-xs text-muted-foreground">Checking status...</p>;
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
