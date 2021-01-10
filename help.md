-- mongo console bağlanma
kubectl exec -it [mongo-pod-name] mongo

-- expose node port
kubectl expose deployment hello-world --type=NodePort --name=example-service

pv
pvc-d33c8d4b-3786-4a15-b594-c553ee4cca0b

-