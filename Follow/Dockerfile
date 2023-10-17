# Sử dụng image có sẵn của Node.js
FROM node:latest AS Follow

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN yarn install

# Sao chép toàn bộ mã nguồn của dịch vụ
COPY . .

# Khai báo cổng mà dịch vụ lắng nghe
EXPOSE 3002

RUN yarn sequelize-auto -h ip_address -d follow -u root -x 181199 -p 5432  --dialect postgres -o src/Model/postgreSQL -l ts

# Khởi chạy dịch vụ khi container được khởi động
CMD ["yarn", "dev"]
