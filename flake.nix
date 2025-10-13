{
  description = "Dev shell with Mermaid CLI (mmdc) installed";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "aarch64-darwin";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.mermaid = pkgs.mkShell {
        name = "foobar";
        buildInputs = [ pkgs.mermaid-cli ];
        shellHook = ''
          # Try common Chrome install locations on macOS
          # Unfortunatly chromium is currently broken for mac on nixpkgs
          if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
            export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          elif [ -x "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
            export PUPPETEER_EXECUTABLE_PATH="/Applications/Chromium.app/Contents/MacOS/Chromium"
          else
            echo "⚠️ Could not find Chrome or Chromium — please install one."
          fi

          echo "🐙 Mermaid CLI ready!"
          echo "Using Chrome at: $PUPPETEER_EXECUTABLE_PATH"
          echo "Example: mmdc -i workflow.mermaid -o diagram.svg && open diagram.svg"
        '';
      };
    };
}
