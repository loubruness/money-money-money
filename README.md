# money-money-money

***Fast test:***
start minikube:

```bash
minikube start -p money-money-money
```

To be updates, the images must be build from the minicubs docker:

* windows:
  ```bash
  & minikube -p money-money-money docker-env --shell powershell | Invoke-Expression
  ```

init sql:

```
kubectl create configmap db-sql-config --from-file=init.sql
```

si la db à déja été initialisée:

```
kubectl delete pvc db-pvc
kubectl apply -f k8s/deployments
```

```
kubectl exec -it db-7bbdf8bdff-9fqs2 -- bash
```

```
psql -U user -d money-money-money
```

```
 minikube -p money-money-money service account-service

```
