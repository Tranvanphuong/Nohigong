# System Patterns

## Kiến trúc hệ thống
- Frontend: Zalo Mini App với React.js
- Backend: Node.js với Express
- Database: MongoDB
- Authentication: Zalo OAuth
- API: RESTful

## Các thành phần chính
1. User Management
   - Đăng nhập qua Zalo
   - Quản lý thông tin cá nhân
   - Lịch sử mua hàng

2. Product Management
   - Danh mục sản phẩm
   - Chi tiết sản phẩm
   - Tìm kiếm và lọc
   - Quản lý kho hàng

3. Order Management
   - Giỏ hàng
   - Thanh toán
   - Theo dõi đơn hàng
   - Quản lý đơn hàng

4. Content Management
   - Quản lý sản phẩm
   - Quản lý danh mục
   - Quản lý khuyến mãi
   - Quản lý banner

## Design Patterns
- MVC cho backend
- Component-based cho frontend
- Repository pattern cho data access
- Factory pattern cho product creation
- Observer pattern cho real-time updates

## Component Structure
- Atomic Design Pattern
  - Atoms: Basic UI components
  - Molecules: Product cards, filters
  - Organisms: Product lists, cart
  - Templates: Page layouts
  - Pages: Final pages

## State Management
- Redux cho global state
- Context API cho local state
- Custom hooks cho cart logic

## API Design
- RESTful endpoints
- GraphQL cho complex queries
- WebSocket cho real-time notifications

## Security Patterns
- Zalo OAuth authentication
- Role-based access control
- Input validation
- Rate limiting
- CORS configuration

## Testing Strategy
- Unit tests với Jest
- Integration tests
- E2E tests với Cypress
- Performance testing 