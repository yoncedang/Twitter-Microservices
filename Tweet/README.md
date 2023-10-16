# Custom-Project

# Deploy to project

-- FIRST: INSTALL docker compose in UBUNTU

sudo apt install docker-compose -y

docker-compose --version (check)




# SERVICES PROJECT

-- MAIN: cd to each services project and run this in terminal

-- docker build -t test-docker-node .

-- docker run -p 7979:7979 test-docker-node -d


# Docker-compose

-- MAIN: cd to main project folder that hold all services and run in terminal

-- docker-compose up -d




# PRISMA custom and run

-- yarn add prisma @prisma/client     (if project still not install, please install this with yarn or npm)

-- yarn prisma init     ( if already install -- run this -- change .env and prisma.chema => mysql/postgreSQL/ another DB )

-- yarn prisma db pull     ( this is method database first will pull table from your database )

-- yarn prisma generate     ( make it fresh .. new ... if your db update column or create new table ... this command will make refresh )



