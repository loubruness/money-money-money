# Money-Money-Money

## Description

**Money-Money-Money** is a microservices architecture for a financial management system. It consists of six microservices:

- **Account Service**: Manages user accounts.
- **Catalog Service**: Manages properties.
- **Email Service**: Handles email sending.
- **Payment Service**: Manages payments.
- **Portfolio Service**: Manages user portfolios.
- **Wallet Service**: Manages digital wallets.

An **API Service** is also available, serving as a single entry point for the system.

A **Postman Collection** is provided for testing the API at the following url: [Postman Collection](https://interstellar-capsule-77572.postman.co/workspace/My-Workspace~5b5b8b60-3c0f-486f-8551-ea4ec3284a3d/collection/40076268-bf4a89a8-5797-4a3e-94d7-50545fefb675?action=share&creator=40076268)

The project can be run using **Kubernetes (Minikube)** or **Docker Compose**.

---

## Launch the Project

### With Kubernetes (Minikube)

1. **Start Minikube and create a cluster**:

   ```bash
   minikube start -p money-money-money
   ```

2. **Build Docker images within the Minikube cluster**:

   - **Windows**:
     ```bash
     & minikube -p money-money-money docker-env --shell powershell | Invoke-Expression
     docker compose build
     ```
   - **MacOS/Linux**:
     ```bash
     eval $(minikube -p money-money-money docker-env)
     docker compose build
     ```

3. **Create a ConfigMap to initialize the database from `init.sql`**:

   ```bash
   kubectl create configmap db-sql-config --from-file=init.sql
   ```

4. **Create other ConfigMaps for the services**:

   ```bash
   kubectl apply -f k8s/configmaps
   ```

5. **Deploy the services to the cluster**:

   ```bash
   kubectl apply -f k8s/deployments
   ```

6. **Apply the Kubernetes services**:

   ```bash
   kubectl apply -f k8s/services
   ```

7. **Make the API accessible**:

   ```bash
   minikube -p money-money-money service api-service
   ```
8. **Test the API**:

   - Access the API via **Postman** at the URL returned by the previous command (replace `http://localhost:5000`).      

---

### With Docker Compose

1. **Run the project with Docker Compose**:

   ```bash
   docker compose up
   ```

2. **Test the API**:

   - Access the API via **Postman** at `http://localhost:5000`.

---

### Notes

- Ensure you have **Minikube**, **Kubectl**, and **Docker Compose** installed before running the project.
- Kubernetes configuration files are located in `k8s/`.
- Docker images must be built before launching the services.
- For any configuration changes, update the ConfigMaps and redeploy the services.

