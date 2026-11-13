import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "../components/beluga/Button";
import { RollingLabel } from "../components/beluga/PresentationLinks";
import { navigation } from "../config/originalContent";
const logo = {
  url: `${import.meta.env.BASE_URL}images/beluga-logo.png`,
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Beluga — início">
          <img src={logo.url} alt="" width="72" height="72" />
          <span>
            beluga<span className="brand-period">.</span>
          </span>
        </a>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              <RollingLabel>{item.label}</RollingLabel>
            </a>
          ))}
        </nav>
        <Button asChild className="header-cta">
          <a href="#demonstracao">
            <RollingLabel>Ver demonstração</RollingLabel> <ArrowUpRight />
          </a>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </header>
      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
              document.querySelector(".menu-toggle")?.focus();
            }
          }}
          aria-label="Navegação móvel"
        >
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight />
            </a>
          ))}
          <a href="#demonstracao" onClick={() => setMenuOpen(false)}>
            Ver demonstração
            <ArrowUpRight />
          </a>
        </nav>
      )}
    </>
  );
}
