push:
	docker build . -t cfcontainersdb.azurecr.io/clearbot/hubot
	docker tag hubot cfcontainersdp.azurecr.io/clearbot/hubot
	docker push cfcontainersdp.azurecr.io/clearbot/hubot

deploy:
	kubectl apply -f ./hubot-k8s.yaml

docker_login:
	az acr login --name cfcontainersdp
