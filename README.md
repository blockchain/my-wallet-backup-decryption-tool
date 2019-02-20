
# My Wallet Backup Decryption Tool

## Install

Requirements: node@4, npm@3

```sh
npm install
```

## Develop

```sh
echo 'ENV=dev' > .env
```

## Run

```sh
npm run build
npm start
```

## Package

```sh
npm run build
npm run pack

# package for specific environment
# options: osx, win32, win64, linux32, linux64
npm run pack:osx
```

To zip for distribution:

```sh
cd dist/
zip -r --symlinks my-wallet-backup-decrypt-osx.zip My\ Wallet\ Backup\ Decryption\ Tool.app/
```

Note for OSX users: in order to package for windows you must have `wine` installed. Install `wine` with Homebrew as follows:

```sh
brew update
brew install wine
```
