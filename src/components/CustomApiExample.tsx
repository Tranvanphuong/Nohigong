import React, { useEffect, useState } from "react";
import { Box, Button, Sheet, Spinner, Text } from "zmp-ui";
import { request, requestWithFallback } from "../utils/request";

// Định nghĩa kiểu dữ liệu trả về từ API
interface CustomApiResponse {
  id: number;
  name: string;
  description: string;
}

const CustomApiExample: React.FC = () => {
  const [data, setData] = useState<CustomApiResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API cơ bản
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sử dụng hàm request có sẵn, truyền vào đường dẫn API endpoint
      const result = await request<CustomApiResponse[]>("/custom-endpoint");
      setData(result);
    } catch (err) {
      setError("Có lỗi xảy ra khi gọi API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API với dữ liệu fallback nếu có lỗi
  const fetchDataWithFallback = async () => {
    setLoading(true);
    // Sử dụng hàm requestWithFallback, truyền vào đường dẫn API và giá trị mặc định
    const result = await requestWithFallback<CustomApiResponse[]>(
      "/custom-endpoint-with-fallback",
      [] // Giá trị mặc định nếu API lỗi
    );
    setData(result);
    setLoading(false);
  };

  // Gọi API với dữ liệu POST
  const postData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await request<{ success: boolean }>(
        "/custom-post-endpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Dữ liệu gửi lên
            name: "Sản phẩm mới",
            price: 100000,
          }),
        }
      );

      if (result.success) {
        // Xử lý khi thành công
        fetchData(); // Tải lại dữ liệu
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Sheet className="p-4">
      <Text.Title className="mb-4">Demo Gọi API Riêng</Text.Title>

      {loading && (
        <Box className="flex justify-center my-4">
          <Spinner />
        </Box>
      )}

      {error && (
        <Box className="bg-red-100 p-3 rounded my-2">
          <Text className="text-red-600">{error}</Text>
        </Box>
      )}

      {data && (
        <Box className="my-4">
          <Text.Title size="small">Dữ liệu từ API:</Text.Title>
          <Box className="mt-2 border rounded p-2">
            {data.length > 0 ? (
              data.map((item) => (
                <Box key={item.id} className="mb-2 pb-2 border-b">
                  <Text bold>{item.name}</Text>
                  <Text>{item.description}</Text>
                </Box>
              ))
            ) : (
              <Text>Không có dữ liệu</Text>
            )}
          </Box>
        </Box>
      )}

      <Box className="flex gap-2 mt-4">
        <Button onClick={fetchData} disabled={loading}>
          Tải dữ liệu
        </Button>
        <Button onClick={postData} disabled={loading} variant="secondary">
          Thêm dữ liệu mới
        </Button>
      </Box>
    </Sheet>
  );
};

export default CustomApiExample;
