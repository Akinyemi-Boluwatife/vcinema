import Logo from "./Logo";
import SignOutButton from "./SignOutButton";
import SearchInputWrapper from "./SearchInputWrapper";
import NavigationWrapper from "./NavigationWrapper";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-surface-low/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <Logo />
        <SearchInputWrapper />
        <NavigationWrapper />
        <SignOutButton />
      </div>
    </nav>
  );
}
