{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      
      # Script to install npm dependencies if not already installed
      installDeps = pkgs.writeShellScript "install-deps" ''
        if [ ! -d "node_modules" ]; then
          echo "Installing npm dependencies..."
          ${pkgs.nodejs}/bin/npm i
        fi
      '';
      
      # Script to run the development server
      runDev = pkgs.writeShellScript "run-dev" ''
        ${installDeps}
        echo "Starting development server..."
        ${pkgs.nodejs}/bin/npm run dev
      '';
    in
    {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
        ];
        shellHook = ''
          ${installDeps}
        '';
      };
      
      apps.default = {
        type = "app";
        program = "${runDev}";
      };
    }
  );
}
