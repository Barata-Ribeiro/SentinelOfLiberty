<div align="center">
    <img alt="The main logo of Sentinel Of Liberty" width="400" src="client/public/sentinel-of-liberty-final.svg" title="Sentinel of Liberty Logo"/>
</div>

Sentinel of Liberty is a full‑stack application providing JWT‑based authentication, rich‑text editing, and real‑time communication via WebSockets. Built to be a place where users can suggest news from third-party news providers, and through this list, the interaction between the ecosystem starts. An admin can freely write an article about said proposed suggestions, offering their opinion/alternate view about it. The project can be fully customized to fit your needs.

## 📚 Features

- JWT authentication & authorization (NextAuth on frontend, Spring Security on backend).
- Rich‑text editor with TipTap (images, links, alignment, history).
- Real‑time updates via WebSockets and STOMP for notifications.
- API documentation with Swagger/OpenAPI.
- Persistence with JPA/Hibernate (H2 for dev/test, PostgreSQL for production).
- Data validation with Bean Validation.

## 🚀 Built With

### Frontend

The frontend of MediManage is built using modern technologies to ensure a responsive and seamless user experience.

- **Next.js 15**: A React framework for server-rendered applications.
- **React 19 + TypeScript**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **NextAuth**: Authentication for Next.js applications.
- **TipTap**: A highly customizable rich text editor built on ProseMirror, offering an intuitive editing experience.
- **STOMP.js**: A lightweight JavaScript client for STOMP messaging over WebSockets, enabling real‑time communication.

### Backend

The backend leverages the power of Spring Boot to provide a scalable and secure foundation for the application.

- **Spring Boot 3.4 \+ Java 23**: Provides a modern, robust framework and leverages the latest Java features for efficient application development.
- **Spring Security**: Implements customizable security measures for authentication and authorization.
- **Spring Data JPA \(Hibernate\)**: Simplifies database interactions by mapping Java objects to relational data using Hibernate as the JPA provider.
- **H2 \& PostgreSQL**: Uses H2 for in-memory dev/test environments and PostgreSQL for production-grade persistence.
- **Swagger\/OpenAPI \(springdoc\-openapi\)**: Automatically generates interactive API documentation, easing API consumption and testing.
- **ModelMapper, Lombok**: Reduces boilerplate with efficient object mappings and code generation through annotations.
-

## 🛠️ Project Setup

1. **Clone repository**

   ```shell
   git clone https://github.com/Barata-Ribeiro/SentinelOfLiberty.git
   cd SentinelOfLiberty
   ```

2. **Environment variables**

   - Frontend: copy `client/.env.local.example` to `client/.env.local` and fill in:
     ```dotenv
     NEXT_PUBLIC_AUTH_TOKEN_NAME="TOKEN_NAME"
     AUTH_SECRET=AUTO_GEN_AUTH_JS_KEY
     AUTH_URL="http://localhost:3000/api/auth"
     AUTH_TRUST_HOST="true"
     NEXT_PUBLIC_BASE_URL="http://localhost:3000"
     NEXT_PUBLIC_BACKEND_ORIGIN="http://localhost:8080"
     ```
   - Backend: choose profile and copy corresponding file to `src/main/resources/application.properties`. Or use IDE
     to set up current profile and run the application using the required variables from each application.properties
     files.

3. **Using Docker & Docker Compose**

   - **Build & run all services**
     ```shell
     docker compose -f compose.yaml up --build
     ```
     This command uses your `Dockerfile` multi‑stage build to produce a lean runtime image, then starts both the API and a PostgreSQL database via Compose citeturn0search0turn0search1.
   - **Access services**
     - Frontend: http://localhost:3000
     - API (Swagger UI): http://localhost:8080/api-docs
     - PostgreSQL: host `localhost:5432`, DB `sentinel-of-liberty_db`, user `postgres`, password `postgres`.

4. **Local development (without Docker)**
   - **Frontend**
     ```shell
     cd client
     npm install
     npm run dev
     ```
   - **Backend**
     ```shell
     cd server
     ./mvnw spring-boot:run
     ```

## 🗂️ Folder Structure

```
.
├── client
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── @types
│   │   ├── actions
│   │   ├── app
│   │   ├── components
│   │   ├── helpers
│   │   ├── providers
│   │   ├── utils
│   │   ├── auth.ts
│   │   └── middleware.ts
│   ├── .env.local
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── server
    ├── .mvn
    ├── src
    │   ├── main
    │   │   └── java/com/barataribeiro/sentinelofliberty
    │   │       ├── builders
    │   │       ├── config
    │   │       ├── controllers
    │   │       ├── dtos
    │   │       ├── exceptions
    │   │       ├── models
    │   │       ├── repositories
    │   │       ├── services
    │   │       ├── utils
    │   │       └── ServerApplication.java
    │   └── test
    │       └── java/com/barataribeiro/sentinelofliberty
    │           ├── config/security
    │           ├── controllers
    │           ├── utils
    │           └── utilsTests
    ├── target
    ├── .gitattributes
    ├── .gitignore
    ├── compose.yaml
    ├── Dockerfile
    ├── HELP.md
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── sentinel-of-liberty.iml
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Barata-Ribeiro/SentinelOfLiberty/issues) if you want to contribute.

## 📜 License

This project is free software available under the [GPLv3](LICENSE) license.
