# ZaUI Fashion

<p style="display: flex; flex-wrap: wrap; gap: 4px">
  <img alt="vite" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/dev/vite" />
  <img alt="react" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/react" />
  <img alt="zmp-ui" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/zmp-ui" />
  <img alt="zmp-sdk" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/zmp-sdk" />
  <img alt="jotai" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/jotai" />
  <img alt="tailwindcss" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-fashion/dev/tailwindcss" />
</p>

A template for online sales applications. It provides full features such as product viewing, shopping cart, payment, etc. Can be used for various industries.

|                      Demo                       |                  Entrypoint                  |
| :---------------------------------------------: | :------------------------------------------: |
| <img src="./docs/preview.webp" alt="Home page"> | <img src="./docs/qr.webp" alt="Entry point"> |

## Setup

### Using Zalo Mini App Extension

1. Install [Visual Studio Code](https://code.visualstudio.com/download) and [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools).
1. Click on **Create Project** > Choose **ZaUI Fashion** template > Wait until the generated project is ready.
1. **Configure App ID** and **Install Dependencies**, then navigate to the **Run** panel > **Start** to develop your Mini App 🚀

### Using Zalo Mini App CLI

> **Note:** Vite 5 compatibility in CLI is under development. Until then, please use the Zalo Mini App Extension.

1. [Install Node JS](https://nodejs.org/en/download/).
1. [Install Zalo Mini App CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/).
1. **Download** or **clone** this repository.
1. **Install dependencies**:
   ```bash
   npm install
   ```
1. **Start** the dev server using `zmp-cli`:
   ```bash
   zmp start
   ```
1. **Open** `localhost:3000` in your browser and start coding 🔥

### Using Zalo Mini App Studio

This template is built using **Vite 5.x**, which is **not compatible** with Zalo Mini App Studio.

## Deployment

1. **Create** a Zalo Mini App ID. For instructions, please refer to the [Coffee Shop Tutorial](https://mini.zalo.me/tutorial/coffee-shop/step-1/).

1. **Deploy** your mini program to Zalo using the ID created.

   If you're using Zalo Mini App Extension: navigate to the Deploy panel > Login > Deploy.

   If you're using `zmp-cli`:

   ```bash
   zmp login
   zmp deploy
   ```

1. Scan the **QR code** using Zalo to preview your mini program.

## Usage:

The repository contains sample UI components for building your application. You may [integrate your APIs](#load-data-from-your-server) to load categories, products, and process orders. You may also modify the code to suit your business needs.

Folder structure:

- **`src`**: Contains all the logic source code of your Mini App. Inside the `src` folder:

  - **`components`**: Reusable components written in React.js.
  - **`css`**: Stylesheets; pre-processors are also supported.
  - **`mock`**: Example data as json files.
  - **`pages`**: A Page is a React component registered in the router that represents a full view. Smaller sections within the page can be components for better maintainability, though they don't necessarily need to be reusable.
  - **`static`**: Static assets to be deployed along with your Mini App. Notice: large static assets should be served from a CDN.
  - **`utils`**: Reusable utility functions, such as API integration, client-side cart management, formatting, etc.
  - **`app.tsx`**: Root component of your entire Mini App. React DOM will mount this component to the element `#app`.
  - **`global.d.ts`**: Contains TypeScript declarations for third-party modules and global objects.
  - **`hooks.ts`**: Custom utility hooks.
  - **`router.ts`**: Router configuration. New pages should be registered here.
  - **`state.ts`**: Global state management. Jotai is used for simplicity and performance.
  - **`types.d.ts`**: TypeScript declarations for business related objects.

- **`app-config.json`**: [Zalo Mini App Configuration](https://mini.zalo.me/documents/intro/getting-started/app-config/).

The other files (such as `tailwind.config.js`, `vite.config.mts`, `tsconfig.json`, `postcss.config.js`, `.eslintrc.js`, and `.prettierrc`) are configurations for libraries used in your application. Visit the library's documentation to learn how to use them.

## Recipes

### Load data from your server

1. In `app-config.json`, set `template.apiUrl` to your API URL.
   ```json
   "template": {
      "apiUrl": "https://my-server.com/api/", // Set this to your API URL
   }
   ```
1. Your server should implement the following APIs:
   - `GET  /categories`: Retrieve a list of categories.
   - `GET  /products`: Retrieve a list of products.
   - `GET  /banners`: Retrieve a list of banner images to display on the home page.

> Refer to the `src/mock/*.json` files for sample data and structure.

> You may wish to add more APIs to support your business needs. For authorization required APIs, the user's identity can be retrieved from the `Authorization: Bearer ${ACCESS_TOKEN}` header sent along with each API request. Visit the [Login with Zalo](https://mini.zalo.me/intro/authen-user/) documentation for more detailed instructions.

### Link Official Account

The template contains 2 OA-related features:

| Feature             | Demo                                        | Configuration                                                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chat with OA button | ![Chat with OA Button](./docs/chat-oa.webp) | In `app-config.json`, set `template.oaIDtoOpenChat` to your OA ID.                                                                                                                                                                                                          |
| Follow OA widget    | ![Follow OA Block](./docs/follow-oa.webp)   | Follow the instructions to [authenticate your Mini App via Zalo OA](https://mini.zalo.me/documents/pages/thong-bao-huong-dan-xac-thuc-mini-app/). For more information, please refer to the [showOAWidget](https://mini.zalo.me/documents/api/showOAWidget/) documentation. |

### Customize theme

Adjust CSS variables in `src/css/tailwind.scss` as needed to fit your desired branding.

| `--primary: red;`                     | `--primary: #008000;`                     |
| ------------------------------------- | ----------------------------------------- |
| ![Red](./docs/primary-color-red.webp) | ![Green](./docs/primary-color-green.webp) |

### Project Structure

```
project/
├── .git/                      # Thư mục Git
├── .vscode/                   # Cấu hình Visual Studio Code
├── docs/                      # Tài liệu và hình ảnh sử dụng trong README
├── node_modules/              # Thư viện dependencies
├── src/                       # Mã nguồn chính của ứng dụng
│   ├── api/                   # Các API calls và các hàm liên quan
│   │   ├── externalApi.ts     # Khai báo các endpoint API bên ngoài
│   │   └── services.ts        # Khai báo các dịch vụ API
│   ├── components/            # Các components có thể tái sử dụng
│   │   ├── vectors/           # Biểu tượng vector và SVG
│   │   ├── button.tsx         # Component nút
│   │   ├── carousel.tsx       # Component trình chiếu
│   │   ├── footer.tsx         # Component footer
│   │   ├── header.tsx         # Component header
│   │   ├── product-item.tsx   # Component hiển thị sản phẩm
│   │   ├── product-grid.tsx   # Grid hiển thị nhiều sản phẩm
│   │   └── ...                # Các components khác
│   ├── css/                   # Stylesheet và cấu hình CSS
│   ├── enums/                 # Các enum được sử dụng trong ứng dụng
│   │   └── OrderStatus.ts     # Enum trạng thái đơn hàng
│   ├── mock/                  # Dữ liệu mẫu để phát triển
│   │   ├── addresses.ts       # Dữ liệu mẫu về địa chỉ
│   │   ├── banners.json       # Dữ liệu mẫu về banner
│   │   ├── categories.json    # Dữ liệu mẫu về danh mục
│   │   └── products.json      # Dữ liệu mẫu về sản phẩm
│   ├── models/                # Định nghĩa các model dữ liệu
│   │   └── Order.ts           # Model đơn hàng
│   ├── pages/                 # Các trang của ứng dụng
│   │   ├── address/           # Trang quản lý địa chỉ
│   │   ├── cart/              # Trang giỏ hàng
│   │   ├── catalog/           # Trang danh mục sản phẩm
│   │   ├── checkout/          # Trang thanh toán
│   │   ├── home/              # Trang chủ
│   │   ├── orders/            # Trang quản lý đơn hàng
│   │   │   ├── index.tsx      # Trang danh sách đơn hàng
│   │   │   └── order-detail.tsx # Trang chi tiết đơn hàng
│   │   ├── payment-success/   # Trang xác nhận thanh toán thành công
│   │   ├── product-detail/    # Trang chi tiết sản phẩm
│   │   ├── profile/           # Trang thông tin người dùng
│   │   └── search/            # Trang tìm kiếm
│   ├── services/              # Các service phục vụ ứng dụng
│   │   └── services.ts        # Các dịch vụ chính của ứng dụng
│   ├── state/                 # Quản lý trạng thái ứng dụng
│   ├── static/                # Tài nguyên tĩnh (hình ảnh, fonts, ...)
│   ├── types/                 # Định nghĩa TypeScript types
│   ├── utils/                 # Các hàm tiện ích
│   │   ├── auth.ts            # Xác thực người dùng
│   │   ├── cart.ts            # Xử lý giỏ hàng
│   │   ├── format.ts          # Định dạng dữ liệu
│   │   ├── formatters.ts      # Các hàm định dạng
│   │   ├── request.ts         # Xử lý HTTP requests
│   │   ├── template.ts        # Hàm liên quan đến template
│   │   └── zma.ts             # Tiện ích cho Zalo Mini App
│   ├── app.ts                 # Cấu hình ứng dụng
│   ├── app.tsx                # Component gốc của ứng dụng
│   ├── global.d.ts            # Khai báo TypeScript toàn cục
│   ├── hooks.ts               # Custom React hooks
│   ├── router.tsx             # Cấu hình định tuyến
│   ├── state.ts               # Quản lý trạng thái ứng dụng (sử dụng Jotai)
│   ├── types.d.ts             # Khai báo TypeScript cho các đối tượng
│   └── types.ts               # Định nghĩa TypeScript types
├── www/                       # Thư mục build sản phẩm
├── .env                       # Biến môi trường
├── .gitignore                 # Cấu hình Git ignore
├── app-config.json            # Cấu hình Zalo Mini App
├── index.html                 # HTML entry point
├── package-lock.json          # Dependency lock file
├── package.json               # Cấu hình npm và dependencies
├── postcss.config.js          # Cấu hình PostCSS
├── tailwind.config.js         # Cấu hình TailwindCSS
├── tsconfig.json              # Cấu hình TypeScript
├── vite.config.mts            # Cấu hình Vite
└── zmp-cli.json               # Cấu hình Zalo Mini App CLI
```

## API Đơn hàng

Hệ thống đã được tích hợp các API để quản lý đơn hàng:

### 1. API tạo đơn hàng

- **Endpoint**: `bizmob/MessageOrderMobs/commit`
- **Method**: POST
- **Chức năng**: Tạo đơn hàng mới

### 2. API lấy chi tiết đơn hàng

- **Endpoint**: `bizmob/MessageOrderMobs/{orderId}`
- **Method**: GET
- **Chức năng**: Lấy thông tin chi tiết của một đơn hàng dựa vào ID

### 3. API lấy danh sách đơn hàng

- **Endpoint**: `bizmob/MessageOrderMobs/list`
- **Method**: POST
- **Chức năng**: Lấy danh sách đơn hàng với phân trang

### Mô hình dữ liệu đơn hàng

Dữ liệu đơn hàng được định nghĩa trong class `OrderImpl` tại `src/models/Order.ts`, bao gồm:

- Thông tin khách hàng và địa chỉ giao hàng
- Thông tin người bán
- Danh sách sản phẩm đặt mua
- Trạng thái đơn hàng
- Phương thức thanh toán
- Tổng tiền đơn hàng

### Trạng thái đơn hàng

Đơn hàng có các trạng thái được định nghĩa trong enum `OrderStatus` tại `src/enums/OrderStatus.ts`:

- `NEW` (10): Đơn mới
- `CONFIRMED` (20): Đã xác nhận
- `PROCESSING` (30): Đang xử lý
- `SHIPPING` (40): Đang giao hàng
- `COMPLETED` (50): Hoàn thành
- `CANCELLED` (60): Đã hủy
- `RETURNED` (70): Đã trả hàng
