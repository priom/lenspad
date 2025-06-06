
import { AccountInfoDialog } from "@/components/account-info";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { Login } from "@/components/login";
import { Search } from "@/components/search";
import { getAuthenticatedAccount } from "@/lib/lens/get-authenticated-account";
import Link from "next/link";

export default async function Header() {

  const account = await getAuthenticatedAccount();
  
  return (
    <header className="w-full bg-background text-foreground md:sticky top-0 z-10 border-b border-border">
      <div className="container mx-auto px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              LENS<span className="text-primary"></span>PAD
            </Link>
          </div>

          <div className="md:col-span-6">
            <Search />
          </div>

          <div className="md:col-span-4 md:pl-4 flex flex-wrap items-center gap-4 justify-between text-sm uppercase">
            <div className="flex">
              <Login />
              <AccountInfoDialog account={account} />

            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
