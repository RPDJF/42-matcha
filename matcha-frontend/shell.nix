with import <nixpkgs> {};

mkShell {
  packages = [
    nodejs_24
    nodePackages."@angular/cli"
  ];
}
