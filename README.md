# money-money-money

***Fast test:***
- First you have to start minikube:

  ```bash
    minikube start -p money-money-money
  ```

- To be updated, the images must be build from the minikube docker daemon, so you have to run the following commands:

  * windows:
    ```bash
      & minikube -p money-money-money docker-env --shell powershell | Invoke-Expression
      docker compose build
    ```

- To init the database, the init.sql file must be in a configmap:

  ```bash
    kubectl create configmap db-sql-config --from-file=init.sql
  ```

- Then you need to apply thes other configmaps to the cluster:

  ```bash
    kubectl apply -f k8s/configmap.yaml
  ```

- Then you need to apply the doplyments to the cluster:

  ```bash
    kubectl apply -f k8s/deployment.yaml
  ```

- Then you need to apply the services to the cluster:

  ```bash
    kubectl apply -f k8s/service.yaml
  ```

- To access the services, you can use the following command:

  ```bash
    minikube -p money-money-money service account-service catalog-service email-service payment-service portfolio-service wallet-service
  ```
