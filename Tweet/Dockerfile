# Sử dụng image có sẵn của Node.js
FROM node:latest AS Tweet

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN yarn install

# Sao chép toàn bộ mã nguồn của dịch vụ
COPY . .

# Khai báo cổng mà dịch vụ lắng nghe
EXPOSE 3003

# Thực hiện lệnh prisma db pull và prisma generate
RUN yarn prisma db pull
RUN yarn prisma generate


# Khởi chạy dịch vụ khi container được khởi động
CMD ["yarn", "dev"]
