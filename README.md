# money-money-money


init sql:

```
kubectl create configmap db-init-config --from-file=init.sql
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
