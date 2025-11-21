# API Gateway

### Installation

```
$ yarn install
```

### Development

```
$ yarn dev
// or
$ make dev
```

### Build Transpiled Codes

```
$ yarn build
// or
$ make build
```

### Start Server on Production

```
// build first
$ make build

// start server
$ make start
// or
$ yarn start
```

### 環境變數設定

請見檔案 [`packages/api-gateway/src/environment-variables.ts`](https://github.com/kids-reporter/kids-reporter-monorepo/blob/dev/packages/api-gateway/src/environment-variables.ts)

開發環境可將 `.env.example` 複製為 `.env.local` 後依需求填入。

`make dev` 與 `make start` 會預設載入 `.env.local`；透過環境變數 `ENV_FILE` 可改用其他檔案。dotenv 預設不會覆寫既有的 shell 環境變數，因此需要覆寫時請先調整 shell 或改用 `--override`。

`make start` 會在載入 dotenv 前將 `NODE_ENV` 設為 `production` 以維持正式環境設定，若需覆寫請於啟動前手動指定。

不存在指定檔案時腳本會提示並以現有 shell 環境變數啟動伺服器。

**如何使用 `--override` flag：**

若需讓 dotenv 覆寫現有的 shell 環境變數，可在執行 make 指令時加上 `DOTENV_FLAGS="--override"`，例如：

```
$ DOTENV_FLAGS="--override" make dev
```
