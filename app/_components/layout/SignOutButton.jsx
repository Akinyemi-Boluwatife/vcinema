"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/_lib/actions";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        aria-label="Sign out"
      >
        <LogOut className="size-3.5" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </form>
  );
}
